import { env, hasAi } from "@/lib/server/env";
import {
  type AiMessage,
  type AiProvider,
  type AiProviderResult,
  type AiReportContext,
  type AiTaskId,
} from "@/lib/server/ai/types";

type ResponsesApiResponse = {
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
  output_text?: string;
};

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
};

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

function parseJsonResponse(rawText: string) {
  const trimmed = rawText.trim();
  if (!trimmed) throw new Error("The model returned an empty response.");

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    const fenced = trimmed.match(/```json\s*([\s\S]*?)```/i) ?? trimmed.match(/```([\s\S]*?)```/i);
    if (fenced?.[1]) {
      return JSON.parse(fenced[1]) as unknown;
    }
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1)) as unknown;
    }
    throw new Error(`The model response was not valid JSON: ${trimmed.slice(0, 240)}`);
  }
}

function extractChatCompletionsText(data: ChatCompletionResponse) {
  const raw = data.choices?.[0]?.message?.content;
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw)) {
    return raw
      .map((item) => item.text ?? "")
      .join("")
      .trim();
  }
  return "";
}

function extractResponsesText(data: ResponsesApiResponse) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const messageText = data.output
    ?.filter((item) => item.type === "message")
    .flatMap((item) => item.content ?? [])
    .map((item) => item.text ?? "")
    .join("")
    .trim();

  if (messageText) return messageText;

  return (
    data.output
      ?.flatMap((item) => item.content ?? [])
      .map((item) => item.text ?? "")
      .join("")
      .trim() ?? ""
  );
}

function extractGeminiText(data: GeminiGenerateContentResponse) {
  return (
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim() ?? ""
  );
}

function normalizeMessages(messages: AiMessage[]) {
  const system = messages
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .join("\n\n");
  const user = messages
    .filter((message) => message.role === "user")
    .map((message) => message.content)
    .join("\n\n");

  return {
    system,
    user,
    combined: [system, user].filter(Boolean).join("\n\n"),
  };
}

async function assertOk(response: Response) {
  if (response.ok) return;
  const body = await response.text();
  throw new Error(`AI provider error (${response.status}): ${body}`);
}

class LiveAiProvider implements AiProvider {
  private async callResponsesApi<T>(request: {
    taskId: AiTaskId;
    promptId: string;
    messages: AiMessage[];
    schema: { parse: (value: unknown) => T };
    context: AiReportContext;
  }): Promise<AiProviderResult<T>> {
    const normalized = normalizeMessages(request.messages);

    const response = await fetch(`${env.aiBaseUrl}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.aiApiKey}`,
      },
      body: JSON.stringify({
        model: env.aiModel,
        temperature: env.aiTemperature,
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text:
                  `${normalized.system}\n\n` +
                  "Return a single valid JSON object only. Do not wrap it in markdown fences.",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: normalized.user,
              },
            ],
          },
        ],
      }),
    });

    await assertOk(response);
    const data = (await response.json()) as ResponsesApiResponse;
    const rawText = extractResponsesText(data);
    const parsed = parseJsonResponse(rawText);

    return {
      object: request.schema.parse(parsed),
      model: env.aiModel,
      provider: "responses",
      rawText,
    };
  }

  private async callChatCompletions<T>(request: {
    taskId: AiTaskId;
    promptId: string;
    messages: AiMessage[];
    schema: { parse: (value: unknown) => T };
    context: AiReportContext;
  }): Promise<AiProviderResult<T>> {
    const response = await fetch(`${env.aiBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.aiApiKey}`,
      },
      body: JSON.stringify({
        model: env.aiModel,
        temperature: env.aiTemperature,
        response_format: { type: "json_object" },
        messages: [
          ...request.messages,
          {
            role: "user",
            content: "Return a single valid JSON object only. Do not wrap it in markdown fences.",
          },
        ],
      }),
    });

    await assertOk(response);
    const data = (await response.json()) as ChatCompletionResponse;
    const rawText = extractChatCompletionsText(data);
    const parsed = parseJsonResponse(rawText);

    return {
      object: request.schema.parse(parsed),
      model: env.aiModel,
      provider: "chat.completions",
      rawText,
    };
  }

  private async callGeminiGenerateContent<T>(request: {
    taskId: AiTaskId;
    promptId: string;
    messages: AiMessage[];
    schema: { parse: (value: unknown) => T };
    context: AiReportContext;
  }): Promise<AiProviderResult<T>> {
    const normalized = normalizeMessages(request.messages);
    const baseUrl = env.aiBaseUrl.replace(/\/v1$/, "");
    const endpoint = `${baseUrl}/gemini/v1beta/models/${env.aiModel}:generateContent`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.aiApiKey}`,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  `${normalized.combined}\n\n` +
                  "Return a single valid JSON object only. Do not wrap it in markdown fences.",
              },
            ],
          },
        ],
        generationConfig: {
          temperature: env.aiTemperature,
        },
      }),
    });

    await assertOk(response);
    const data = (await response.json()) as GeminiGenerateContentResponse;
    const rawText = extractGeminiText(data);
    const parsed = parseJsonResponse(rawText);

    return {
      object: request.schema.parse(parsed),
      model: env.aiModel,
      provider: "gemini.generateContent",
      rawText,
    };
  }

  async generateObject<T>(request: {
    taskId: AiTaskId;
    promptId: string;
    messages: AiMessage[];
    schema: { parse: (value: unknown) => T };
    context: AiReportContext;
  }): Promise<AiProviderResult<T>> {
    switch (env.aiProvider) {
      case "chat.completions":
        return this.callChatCompletions(request);
      case "gemini.generateContent":
        return this.callGeminiGenerateContent(request);
      case "responses":
      default:
        return this.callResponsesApi(request);
    }
  }
}

function buildPreviewCopy(
  context: AiReportContext,
  system: "western" | "eastern",
) {
  const preview = system === "western" ? context.westernPreview : context.easternPreview;
  const systemLabel = system === "western" ? "western star pattern" : "eastern structure";

  return {
    title: preview.title,
    summary: `${preview.teaser} ${preview.detailSummary}`,
    body:
      `${context.user.name} reads as ${context.baseProfile.archetype.toLowerCase()} energy in the current cycle. ` +
      `${preview.personalityHook} In practice, this ${systemLabel} is strongest when ${context.baseProfile.dominantElement} ` +
      `stays visible without overcorrecting for ${context.baseProfile.weakestElement}.`,
    keyConclusions: [
      preview.teaser,
      preview.detailSummary,
      preview.personalityHook,
    ],
  };
}

function buildCrossoverCopy(context: AiReportContext) {
  const name = context.user.name;
  const dominant = context.baseProfile.dominantElement;
  const weakest = context.baseProfile.weakestElement;
  const support = context.baseProfile.supportElement;

  return {
    headline: `${name}的 Cross Over 融合分析`,
    summary:
      `${name}现在经历的，不只是情绪层面的起伏，而是内在结构和外部时势同时推着你换挡。` +
      `你的主导力量是${dominant}，而${support}像一个桥，把这种内在感受慢慢变成现实里看得见的动作和结果。`,
    sections: [
      {
        key: "opening",
        title: "一、开篇总述",
        body:
          `${name}最近容易有一种“已经在变了，但还没完全换挡”的体感。西方这边，你的内在驱动力已经在推动你重新理解自己；东方这边，时势也在把原本藏着的力量往前推，所以变化不只是想法上的，而是节奏上的。`,
      },
      {
        key: "identity",
        title: "二、你是谁：核心人格与内在结构",
        body:
          `你的核心底色是${context.baseProfile.archetype}。这意味着你并不是没有判断力，而是判断来得太快、太细，所以常常先在心里处理完很多层，才决定要不要表达。西方看见的是这种内在敏感与驱动力，东方则补充了为什么这种结构在当前阶段会被放大。`,
      },
      {
        key: "timing",
        title: "三、当前阶段与大势判断",
        body:
          `现在的大势更偏向“把已有的东西拿出来”，而不是继续闷在内部酝酿。东方系统会说这是时势切换到了更适合外显的阶段，西方系统则解释为什么这件事对你来说会同时带来兴奋和压力，因为${weakest}还在提醒你谨慎。`,
      },
      {
        key: "tension",
        title: "四、内在与外部之间的张力",
        body:
          `你眼下最真实的拉扯，是想往前走的部分已经准备好了，但负责自我校验的那部分还没完全松手。东方强调${dominant}已经具备推进条件，西方则提示你旧有的防御机制还会要求更多确认，于是“想动”和“再等等”会同时出现。`,
      },
      {
        key: "signals",
        title: "五、信号与线索",
        body:
          `关系里，你会更在意互动中的安全感和回应节奏，这部分很值得单独细看。事业上，外显表达和方向选择正在变得更重要，也不是几句话能讲完的。身体层面，节律失衡时的消耗会更容易被你感知；成长层面，真正要处理的是旧模式和新阶段之间的过渡。`,
      },
      {
        key: "future",
        title: "六、未来一段时间的重点提醒",
        body:
          `接下来这段时间更适合“先做出可见动作，再在动作里修正”。东方会把这理解成时势已经给了窗口，西方则提醒你不用等到百分之百确定才开始，因为真正的清晰感会在移动之后长出来。`,
      },
      {
        key: "closing",
        title: "七、结尾收束",
        body:
          `你现在经历的不是无意义的混乱，而是内在更新和时势换挡同时发生时的正常震动。先让最强的那部分开始发声，剩下的会在路上逐渐对齐。`,
      },
    ],
    resonance:
      `${dominant}是你这段时间最可用、也最值得信任的主线。`,
    tension:
      `${weakest}对应的部分还在向安全感靠拢，但外部节奏已经开始要求你移动。`,
    personalityPattern:
      `你的模式不是靠强推取胜，而是让${dominant}先启动，再由${support}把它翻译成外部世界能接住的形式。`,
    currentTimingSignal:
      `这段时间更适合先出现、先动作，再在反馈里修正。`,
    nextMove:
      `先做一个能让你最强模式被看见的具体动作，不要再让它只停留在内部排练。`,
    shareCaption:
      `这阶段不是要变成别人，而是让你最强的那部分，终于被现实看见。`,
    signalRelationship:
      `关系里的重点，是你表达需要的速度和你退回自我保护的速度之间的落差。`,
    signalCareer:
      `事业里的压力，来自你真实标准和你允许自己出手的速度之间的差距。`,
    signalGrowth:
      `成长不是再想一轮，而是开始表达之后才真正发生。`,
    signalHealth:
      `健康上的提醒，多半会出现在节律失衡、脑内负荷过高或休息不稳的时候。`,
  };
}

function buildDeepDiveCopy(
  context: AiReportContext,
  domain:
    | "deep-dive-relationship"
    | "deep-dive-career"
    | "deep-dive-growth"
    | "deep-dive-health"
    | "deep-dive-bundle",
) {
  const labelMap = {
    "deep-dive-relationship": {
      headline: "Relationship Deep Dive",
      focus: "say the hard thing before it turns into the heavy thing",
      caution: "Do not confuse distance with clarity.",
      mantra: "Honesty lands better when I stop wrapping it in delay.",
      question: "最近一次让你一直放不下的关系瞬间，具体是怎么发生的？",
      summary:
        "This deep dive focuses on emotional pacing, need expression, and the way timing pressure changes closeness.",
    },
    "deep-dive-career": {
      headline: "Career Deep Dive",
      focus: "ship one visible move before you over-negotiate with yourself",
      caution: "Do not hide strategic hesitation behind perfection.",
      mantra: "Direction becomes clearer after committed motion begins.",
      question: "你现在最想推进、却一直没有真正开始的工作方向是什么？",
      summary:
        "This deep dive focuses on work rhythm, visible output, and the kind of path your current cycle can actually support.",
    },
    "deep-dive-growth": {
      headline: "Personal Growth Deep Dive",
      focus: "untangle the part that drains you most before solving everything",
      caution: "Do not demand total clarity before allowing any movement.",
      mantra: "I can begin before every inner conflict is fully resolved.",
      question: "最近最消耗你的那一部分，具体更像是压力、失望，还是反复自我怀疑？",
      summary:
        "This deep dive focuses on inner loops, emotional weight, and the gentler pace that helps real change happen.",
    },
    "deep-dive-health": {
      headline: "Health Deep Dive",
      focus: "protect rhythm before chasing intensity",
      caution: "Do not wait for obvious depletion before adjusting your habits.",
      mantra: "Steady care works better for me than dramatic correction.",
      question: "最近身体最先提醒你的地方，通常是睡眠、胃口，还是持续疲劳？",
      summary:
        "This deep dive focuses on rhythm, depletion patterns, and the kinds of care that support your current constitution.",
    },
    "deep-dive-bundle": {
      headline: "Cross-Over Bundle",
      focus: "treat this phase like a full-system recalibration",
      caution: "Do not solve one area in a way that quietly destabilizes the others.",
      mantra: "When my timing and inner truth align, every area gets cleaner.",
      question: "如果现在只能先处理一个维度，你最想先把哪一块理顺？",
      summary:
        "This bundle view gathers the strongest signals across relationship, work, health, and growth into one coordinated reading.",
    },
  } as const;

  const copy = labelMap[domain];
  const domainHint = context.order.domain ?? "bundle";

  return {
    headline: copy.headline,
    summary: copy.summary,
    sections: [
      {
        key: "opening",
        title: "Current State",
        body:
          `The current ${domainHint} theme feels louder because your inner processing speed and external timing are no longer moving quietly in parallel. What used to stay manageable in the background is now asking for attention.`,
      },
      {
        key: "pattern",
        title: "Pattern",
        body:
          `Your default pattern is to process deeply before you reveal anything. That gives you nuance, but it can also make timing feel heavier than it needs to be. In this area, the deeper issue is less about lack of capacity and more about how long you hold yourself at the threshold.`,
      },
      {
        key: "timing",
        title: "Timing",
        body:
          `The present cycle supports clearer movement, but it does not necessarily feel comfortable yet. The timing is asking for visible adjustment now, while your older habits are still asking for more certainty first. That mismatch is exactly why the theme feels intense.`,
      },
      {
        key: "guidance",
        title: "Guidance",
        body:
          `The most useful move here is to reduce delay without forcing drama. Let the next step be concrete, small enough to sustain, and honest enough to break the loop you already recognize.`,
      },
      {
        key: "closing",
        title: "Closing",
        body:
          `You do not need to master the whole pattern in one pass. What matters is choosing a pace that keeps you in contact with reality instead of only with your internal rehearsal.`,
      },
    ],
    followUpQuestion: copy.question,
    shareCaption: `My O.O.D ${copy.headline.toLowerCase()} says this season works better when I stop waiting for perfect certainty.`,
    actionFocus: copy.focus,
    caution: copy.caution,
    mantra: copy.mantra,
  };
}

class MockAiProvider implements AiProvider {
  async generateObject<T>(request: {
    taskId: AiTaskId;
    promptId: string;
    messages: AiMessage[];
    schema: { parse: (value: unknown) => T };
    context: AiReportContext;
  }): Promise<AiProviderResult<T>> {
    const object = (() => {
      switch (request.taskId) {
        case "western-preview":
          return buildPreviewCopy(request.context, "western");
        case "eastern-preview":
          return buildPreviewCopy(request.context, "eastern");
        case "crossover-report":
          return buildCrossoverCopy(request.context);
        case "deep-dive-relationship":
          return buildDeepDiveCopy(request.context, "deep-dive-relationship");
        case "deep-dive-career":
          return buildDeepDiveCopy(request.context, "deep-dive-career");
        case "deep-dive-growth":
          return buildDeepDiveCopy(request.context, "deep-dive-growth");
        case "deep-dive-health":
          return buildDeepDiveCopy(request.context, "deep-dive-health");
        case "deep-dive-bundle":
          return buildDeepDiveCopy(request.context, "deep-dive-bundle");
      }
    })();

    return {
      object: request.schema.parse(object),
      model: "mock-composer-v1",
      provider: "mock",
    };
  }
}

export function createAiProvider(): AiProvider {
  if (env.aiProvider !== "mock" && hasAi()) {
    return new LiveAiProvider();
  }

  return new MockAiProvider();
}
