import { renderTemplate } from "@/lib/server/ai/template";
import {
  aiTaskOutputSchemas,
  type AiMessage,
  type AiReportContext,
  type AiTaskId,
  type AiTaskRequest,
} from "@/lib/server/ai/types";

type PromptDefinition<TTask extends AiTaskId = AiTaskId> = {
  id: string;
  taskId: TTask;
  system: string;
  user: string;
};

const promptCatalog = {
  "western-preview": {
    id: "flowith-western-preview-v1",
    taskId: "western-preview",
    system:
      "You are composing a Western natal preview for O.O.D. Reply as JSON only. The response must feel human, warm, and emotionally intelligent, but still remain structurally grounded. Never mention prompts, instructions, models, or implementation details.",
    user: `
Generate a western preview object for {{user.name}}.

Use this context:
- Birth date: {{user.birthDate}}
- Birth time: {{user.birthTime}}
- Birth city: {{user.birthCity}}
- Core archetype: {{baseProfile.archetype}}
- Dominant element: {{baseProfile.dominantElement}}
- Weakest element: {{baseProfile.weakestElement}}
- Existing western teaser: {{westernPreview.teaser}}
- Existing western detail summary: {{westernPreview.detailSummary}}
- Existing western personality hook: {{westernPreview.personalityHook}}

Return JSON with:
- title
- summary
- body
- keyConclusions (2-5 strings)

Requirements:
- Do not output markdown.
- Do not output anything outside JSON.
- Keep the tone specific rather than generic.
- Only use facts available in the provided context.
- Do not invent zodiac signs, planetary placements, houses, aspects, transits, or birth-chart specifics that were not given.
`,
  },
  "eastern-preview": {
    id: "flowith-eastern-preview-v1",
    taskId: "eastern-preview",
    system:
      "You are composing an Eastern metaphysics preview for O.O.D. Reply as JSON only. The voice should feel calm, restrained, and professional without sounding cold or mystical for its own sake.",
    user: `
Generate an eastern preview object for {{user.name}}.

Use this context:
- Birth date: {{user.birthDate}}
- Birth time: {{user.birthTime}}
- Birth city: {{user.birthCity}}
- Seasonal tone: {{baseProfile.seasonalTone}}
- Day phase: {{baseProfile.dayPhase}}
- Dominant element: {{baseProfile.dominantElement}}
- Weakest element: {{baseProfile.weakestElement}}
- Existing eastern teaser: {{easternPreview.teaser}}
- Existing eastern detail summary: {{easternPreview.detailSummary}}
- Existing eastern personality hook: {{easternPreview.personalityHook}}

Return JSON with:
- title
- summary
- body
- keyConclusions (2-5 strings)

Requirements:
- Do not output markdown.
- Do not output anything outside JSON.
- Translate abstract signals into real-life language.
- Only use facts available in the provided context.
- Do not invent pillars, ten gods, luck cycles, yearly cycles, or any classical metaphysics detail that was not explicitly provided.
`,
  },
  "crossover-report": {
    id: "flowith-crossover-report-v1",
    taskId: "crossover-report",
    system:
      "You are composing a Cross Over report that fuses Western inner-pattern reading with Eastern timing/season reading. Reply as JSON only. The user-facing language must be Chinese unless the user's name is clearly non-Chinese. The report must feel intimate, observant, and grounded in lived reality. Never explain methodology, never mention prompts, and never sound like a generic spirituality app.",
    user: `
Generate a crossover report object for {{user.name}}.

Use this context:
- Archetype: {{baseProfile.archetype}}
- Dominant element: {{baseProfile.dominantElement}}
- Weakest element: {{baseProfile.weakestElement}}
- Support element: {{baseProfile.supportElement}}
- Core conclusion: {{baseProfile.coreConclusion}}
- Today signal: {{baseProfile.todaySignal}}
- Western preview teaser: {{westernPreview.teaser}}
- Western preview hook: {{westernPreview.personalityHook}}
- Eastern preview teaser: {{easternPreview.teaser}}
- Eastern preview hook: {{easternPreview.personalityHook}}

Return JSON with:
- headline
- summary
- sections: array of exactly 7 items with key, title, body
- resonance
- tension
- personalityPattern
- currentTimingSignal
- nextMove
- shareCaption
- signalRelationship
- signalCareer
- signalGrowth
- signalHealth

Requirements:
- This is not two reports stitched together. Every major section must visibly combine "Western inner trigger" and "Eastern timing/stage".
- The core question is: "为什么是这样的我，偏偏在现在，经历这样的变化。"
- Write in Chinese for this user.
- The seven sections must use these exact keys and titles in order:
  1. opening / 一、开篇总述
  2. identity / 二、你是谁：核心人格与内在结构
  3. timing / 三、当前阶段与大势判断
  4. tension / 四、内在与外部之间的张力
  5. signals / 五、信号与线索
  6. future / 六、未来一段时间的重点提醒
  7. closing / 七、结尾收束
- Section 5 must only hint at relationship, career, health, and growth. Do not fully analyze them and do not give detailed advice there.
- Avoid abstract one-word English titles such as "Pattern" or "Transition".
- Avoid generic affirmations, fate language, or mystical filler.
- Make the prose feel like it is speaking to the user's current life situation, not to an archetype in the abstract.
- The summary field should be 2-3 Chinese sentences, not a slogan.
- Each signal field must be one short Chinese sentence.
- Do not invent unsupported specifics such as zodiac signs, planetary houses, transits, pillars, ten gods, or exact fate-cycle details unless they were explicitly provided in the context.
- Do not output markdown or any text outside JSON.
`,
  },
  "deep-dive-relationship": {
    id: "flowith-deep-dive-relationship-v1",
    taskId: "deep-dive-relationship",
    system:
      "You are composing a paid relationship deep dive for O.O.D. Reply as JSON only. The tone should be warm, emotionally intelligent, and non-judgmental.",
    user: `
Generate a relationship deep-dive object for {{user.name}}.

Use this context:
- Cross-over relationship signal: {{order.domain}}
- Archetype: {{baseProfile.archetype}}
- Dominant element: {{baseProfile.dominantElement}}
- Weakest element: {{baseProfile.weakestElement}}
- Western hook: {{westernPreview.personalityHook}}
- Eastern hook: {{easternPreview.personalityHook}}

Return JSON with:
- headline
- summary
- sections: array of 4-6 items with key, title, body
- followUpQuestion
- shareCaption
- actionFocus
- caution
- mantra

Requirements:
- Keep it specific and relational.
- Do not pronounce fate or certainty.
- Output JSON only.
`,
  },
  "deep-dive-career": {
    id: "flowith-deep-dive-career-v1",
    taskId: "deep-dive-career",
    system:
      "You are composing a paid career deep dive for O.O.D. Reply as JSON only. The tone should be clear, practical, and perceptive.",
    user: `
Generate a career deep-dive object for {{user.name}}.

Use this context:
- Archetype: {{baseProfile.archetype}}
- Dominant element: {{baseProfile.dominantElement}}
- Weakest element: {{baseProfile.weakestElement}}
- Core conclusion: {{baseProfile.coreConclusion}}
- Career signal hint: {{order.domain}}

Return JSON with:
- headline
- summary
- sections: array of 4-6 items with key, title, body
- followUpQuestion
- shareCaption
- actionFocus
- caution
- mantra

Requirements:
- Keep the strategy advice concrete without being bossy.
- Output JSON only.
`,
  },
  "deep-dive-growth": {
    id: "flowith-deep-dive-growth-v1",
    taskId: "deep-dive-growth",
    system:
      "You are composing a paid personal growth deep dive for O.O.D. Reply as JSON only. The tone should feel grounding, patient, and compassionate.",
    user: `
Generate a growth deep-dive object for {{user.name}}.

Use this context:
- Archetype: {{baseProfile.archetype}}
- Dominant element: {{baseProfile.dominantElement}}
- Weakest element: {{baseProfile.weakestElement}}
- Core conclusion: {{baseProfile.coreConclusion}}

Return JSON with:
- headline
- summary
- sections: array of 4-6 items with key, title, body
- followUpQuestion
- shareCaption
- actionFocus
- caution
- mantra

Requirements:
- Give the reader emotional room.
- Avoid generic motivational language.
- Output JSON only.
`,
  },
  "deep-dive-health": {
    id: "flowith-deep-dive-health-v1",
    taskId: "deep-dive-health",
    system:
      "You are composing a paid health rhythm deep dive for O.O.D. Reply as JSON only. The tone should be calm, caring, and non-diagnostic.",
    user: `
Generate a health deep-dive object for {{user.name}}.

Use this context:
- Archetype: {{baseProfile.archetype}}
- Dominant element: {{baseProfile.dominantElement}}
- Weakest element: {{baseProfile.weakestElement}}
- Day phase: {{baseProfile.dayPhase}}
- Seasonal tone: {{baseProfile.seasonalTone}}

Return JSON with:
- headline
- summary
- sections: array of 4-6 items with key, title, body
- followUpQuestion
- shareCaption
- actionFocus
- caution
- mantra

Requirements:
- No diagnosis, no treatment plan, no fear tactics.
- Output JSON only.
`,
  },
  "deep-dive-bundle": {
    id: "flowith-deep-dive-bundle-v1",
    taskId: "deep-dive-bundle",
    system:
      "You are composing a paid bundle synthesis for O.O.D. Reply as JSON only. The tone should feel integrated, steady, and high-signal.",
    user: `
Generate a bundle deep-dive object for {{user.name}}.

Use this context:
- Archetype: {{baseProfile.archetype}}
- Dominant element: {{baseProfile.dominantElement}}
- Weakest element: {{baseProfile.weakestElement}}
- Support element: {{baseProfile.supportElement}}
- Core conclusion: {{baseProfile.coreConclusion}}

Return JSON with:
- headline
- summary
- sections: array of 4-6 items with key, title, body
- followUpQuestion
- shareCaption
- actionFocus
- caution
- mantra

Requirements:
- Treat this as a coordinated multi-domain reading, not four separate mini reports.
- Output JSON only.
`,
  },
} as const satisfies Record<AiTaskId, PromptDefinition>;

function toTemplateVariables(context: AiReportContext) {
  return {
    user: context.user,
    baseProfile: context.baseProfile,
    westernPreview: context.westernPreview,
    easternPreview: context.easternPreview,
    order: context.order,
  };
}

export function buildTaskRequest<TTask extends AiTaskId>(
  taskId: TTask,
  context: AiReportContext,
): AiTaskRequest<TTask> {
  const prompt = promptCatalog[taskId];
  const variables = toTemplateVariables(context);
  const messages: AiMessage[] = [
    {
      role: "system",
      content: prompt.system,
    },
    {
      role: "user",
      content: renderTemplate(prompt.user, variables),
    },
  ];

  return {
    taskId,
    promptId: prompt.id,
    messages,
    schema: aiTaskOutputSchemas[taskId],
    context,
  };
}

export const AI_PROMPT_VERSION = "flowith-prompts-2026-04-23";
