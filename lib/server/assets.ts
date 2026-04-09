import { promises as fs } from "node:fs";
import path from "node:path";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { APP_NAME, ENTERTAINMENT_DISCLAIMER } from "@/lib/constants";
import { type ReportRecord } from "@/lib/types";

const reportsDir = path.join(process.cwd(), "data", "generated", "reports");

async function ensureReportDir(reportId: string) {
  const dir = path.join(reportsDir, reportId);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

function reportHtml(report: ReportRecord) {
  const receipt = report.receipt;
  const crossover = report.crossover;
  const palette = report.elementProfile.palette;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${APP_NAME} Manifest Receipt</title>
    <style>
      body {
        margin: 0;
        font-family: Georgia, serif;
        background:
          radial-gradient(circle at top, ${palette.glow}22, transparent 32%),
          linear-gradient(180deg, ${palette.base}, #04050a);
        color: #f8f5ef;
      }
      .wrap {
        max-width: 760px;
        margin: 0 auto;
        padding: 48px 24px 96px;
      }
      .card {
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 28px;
        padding: 32px;
        background: rgba(8, 10, 19, 0.75);
        box-shadow: 0 20px 70px rgba(0,0,0,0.35);
      }
      .eyebrow {
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: ${palette.accent};
        font-size: 12px;
      }
      h1 {
        font-size: 48px;
        line-height: 1;
        margin: 12px 0 8px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
        margin: 24px 0;
      }
      .cell {
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 20px;
        padding: 18px;
        background: rgba(255,255,255,0.03);
      }
      .label {
        color: rgba(255,255,255,0.64);
        font-size: 12px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }
      .value {
        margin-top: 10px;
        font-size: 18px;
        line-height: 1.45;
      }
      .disclaimer {
        margin-top: 24px;
        color: rgba(255,255,255,0.56);
        font-size: 12px;
      }
      @media (max-width: 720px) {
        h1 { font-size: 34px; }
        .grid { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    <main class="wrap">
      <section class="card">
        <div class="eyebrow">Object of Desire</div>
        <h1>${report.kind === "crossover_base" ? "Cross-Over Report" : "Deep Dive Report"}</h1>
        <p>${report.kind === "crossover_base" ? (crossover?.synthesisSummary ?? "") : (receipt?.summary ?? "")}</p>
        <div class="grid">
          ${
            report.kind === "crossover_base"
              ? `
          <div class="cell"><div class="label">Eastern</div><div class="value">${crossover?.eastern.title ?? ""}</div></div>
          <div class="cell"><div class="label">Western</div><div class="value">${crossover?.western.title ?? ""}</div></div>
          <div class="cell"><div class="label">Resonance</div><div class="value">${crossover?.resonance ?? ""}</div></div>
          <div class="cell"><div class="label">Tension</div><div class="value">${crossover?.tension ?? ""}</div></div>
          <div class="cell"><div class="label">Timing</div><div class="value">${crossover?.currentTimingSignal ?? ""}</div></div>
          <div class="cell"><div class="label">Next Move</div><div class="value">${crossover?.nextMove ?? ""}</div></div>
          `
              : `
          <div class="cell"><div class="label">Theme</div><div class="value">${receipt?.theme ?? ""}</div></div>
          <div class="cell"><div class="label">Today's Pull</div><div class="value">${receipt?.tarotCard ?? ""}</div></div>
          <div class="cell"><div class="label">Best Move Today</div><div class="value">${receipt?.action ?? ""}</div></div>
          <div class="cell"><div class="label">Avoid Today</div><div class="value">${receipt?.caution ?? ""}</div></div>
          <div class="cell"><div class="label">Mantra</div><div class="value">${receipt?.mantra ?? ""}</div></div>
          <div class="cell"><div class="label">Energy Score</div><div class="value">${receipt?.energyScore ?? ""}/100</div></div>
          `
          }
        </div>
        <div class="disclaimer">${ENTERTAINMENT_DISCLAIMER}</div>
      </section>
    </main>
  </body>
</html>`;
}

function shareSvg(report: ReportRecord) {
  const receipt = report.receipt;
  const crossover = report.crossover;
  const palette = report.elementProfile.palette;
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="${palette.base}" offset="0%"/>
      <stop stop-color="#09070d" offset="100%"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="980" cy="120" r="220" fill="${palette.glow}" fill-opacity="0.10"/>
  <circle cx="200" cy="520" r="180" fill="${palette.accent}" fill-opacity="0.10"/>
  <text x="86" y="118" fill="${palette.accent}" font-size="24" font-family="Georgia, serif" letter-spacing="6">OBJECT OF DESIRE</text>
  <text x="86" y="220" fill="#F7F4EF" font-size="78" font-family="Georgia, serif">${report.kind === "crossover_base" ? "Cross-Over" : "Deep Dive"}</text>
  <text x="86" y="300" fill="#F7F4EF" font-size="78" font-family="Georgia, serif">${report.kind === "crossover_base" ? "Report" : "Report"}</text>
  <text x="86" y="390" fill="#E8DFD4" font-size="34" font-family="Georgia, serif">${escapeXml(report.kind === "crossover_base" ? (crossover?.nextMove ?? "") : (receipt?.mantra ?? ""))}</text>
  <text x="86" y="478" fill="#B7B0C0" font-size="24" font-family="Arial, sans-serif">${report.kind === "crossover_base" ? `Eastern: ${escapeXml(crossover?.eastern.title ?? "")}` : `Today's pull: ${escapeXml(receipt?.tarotCard ?? "")}`}</text>
  <text x="86" y="530" fill="#B7B0C0" font-size="24" font-family="Arial, sans-serif">${report.kind === "crossover_base" ? `Western: ${escapeXml(crossover?.western.title ?? "")}` : `Energy score: ${receipt?.energyScore ?? 0}/100`}</text>
  <text x="86" y="580" fill="#918A9B" font-size="16" font-family="Arial, sans-serif">${escapeXml(ENTERTAINMENT_DISCLAIMER)}</text>
</svg>`;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

async function createPdf(report: ReportRecord) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const serif = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const receipt = report.receipt;
  const crossover = report.crossover;
  const palette = report.elementProfile.palette;

  page.drawRectangle({
    x: 0,
    y: 0,
    width: 595,
    height: 842,
    color: rgb(0.03, 0.03, 0.06),
  });

  page.drawText("OBJECT OF DESIRE", {
    x: 48,
    y: 786,
    size: 14,
    font: bold,
    color: rgb(0.85, 0.54, 0.78),
  });

  page.drawText(report.kind === "crossover_base" ? "Cross-Over Report" : "Deep Dive Report", {
    x: 48,
    y: 730,
    size: 30,
    font: bold,
    color: rgb(0.97, 0.95, 0.92),
  });

  const lines = [
    ...(report.kind === "crossover_base"
      ? [
          `Eastern: ${crossover?.eastern.title ?? ""}`,
          `Western: ${crossover?.western.title ?? ""}`,
          `Resonance: ${crossover?.resonance ?? ""}`,
          `Tension: ${crossover?.tension ?? ""}`,
          `Timing: ${crossover?.currentTimingSignal ?? ""}`,
          `Next move: ${crossover?.nextMove ?? ""}`,
          "",
          crossover?.synthesisSummary ?? "",
        ]
      : [
          `Theme: ${receipt?.theme ?? ""}`,
          `Today's pull: ${receipt?.tarotCard ?? ""}`,
          `Best move today: ${receipt?.action ?? ""}`,
          `Avoid today: ${receipt?.caution ?? ""}`,
          `Mantra: ${receipt?.mantra ?? ""}`,
          `Energy score: ${receipt?.energyScore ?? 0}/100`,
          "",
          receipt?.summary ?? "",
        ]),
    "",
    ENTERTAINMENT_DISCLAIMER,
  ];

  let y = 672;
  for (const line of lines) {
    page.drawText(line, {
      x: 48,
      y,
      size: line === ENTERTAINMENT_DISCLAIMER ? 11 : 15,
      font: line.startsWith("Theme:") ? bold : serif,
      color:
        line === ENTERTAINMENT_DISCLAIMER
          ? rgb(0.65, 0.64, 0.7)
          : rgb(0.95, 0.95, 0.94),
      maxWidth: 495,
    });
    y -= line.length > 80 ? 38 : 26;
  }

  page.drawRectangle({
    x: 420,
    y: 700,
    width: 120,
    height: 120,
    color: rgb(0.1, 0.12, 0.2),
    borderColor: rgb(0.9, 0.65, 0.75),
    borderWidth: 1,
  });

  page.drawText(report.kind === "crossover_base" ? "Cross-Over" : receipt?.tarotCard ?? "", {
    x: 438,
    y: 760,
    size: 16,
    font: bold,
    color: rgb(0.97, 0.95, 0.92),
  });

  page.drawText(
    `${report.elementProfile.archetype}\n${palette.accent.toUpperCase()}`,
    {
      x: 438,
      y: 724,
      size: 10,
      font: serif,
      color: rgb(0.78, 0.84, 0.9),
      lineHeight: 13,
    },
  );

  return Buffer.from(await pdfDoc.save());
}

export async function generateReportAssets(report: ReportRecord) {
  const dir = await ensureReportDir(report.id);
  const html = reportHtml(report);
  const svg = shareSvg(report);
  const pdf = await createPdf(report);

  const htmlPath = path.join(dir, "receipt.html");
  const pngPath = path.join(dir, "share-card.svg");
  const pdfPath = path.join(dir, "receipt.pdf");

  await Promise.all([
    fs.writeFile(htmlPath, html, "utf8"),
    fs.writeFile(pngPath, svg, "utf8"),
    fs.writeFile(pdfPath, pdf),
  ]);

  return {
    htmlPath,
    pngPath,
    pdfPath,
    assets: [
      { kind: "html" as const, url: `/api/report/${report.id}/download?kind=html` },
      { kind: "png" as const, url: `/api/report/${report.id}/download?kind=png` },
      { kind: "pdf" as const, url: `/api/report/${report.id}/download?kind=pdf` },
    ],
  };
}

export async function readGeneratedAsset(reportId: string, kind: "html" | "pdf" | "png") {
  const dir = path.join(reportsDir, reportId);
  const fileName =
    kind === "html" ? "receipt.html" : kind === "pdf" ? "receipt.pdf" : "share-card.svg";
  const filePath = path.join(dir, fileName);
  return fs.readFile(filePath);
}
