import { Resend } from "resend";

import { absoluteUrl } from "@/lib/utils";
import { env, hasResend } from "@/lib/server/env";

export async function sendReceiptEmail(input: {
  to: string;
  reportId: string;
  mantra: string;
}) {
  const reportUrl = absoluteUrl(`/report/${input.reportId}?email=${encodeURIComponent(input.to)}`);

  if (!hasResend()) {
    return {
      provider: "mock",
      accepted: true,
      preview: `Email skipped. Open ${reportUrl}`,
    };
  }

  const resend = new Resend(env.resendApiKey);

  return resend.emails.send({
    from: env.resendFrom,
    to: [input.to],
    subject: "Your O.O.D Manifest Receipt is ready",
    html: `
      <div style="font-family: Georgia, serif; background:#090a10; color:#f6f0e8; padding:32px;">
        <p style="letter-spacing:0.22em; text-transform:uppercase; color:#ff7bd3;">Object of Desire</p>
        <h1 style="font-size:38px; margin:0 0 12px;">Your Manifest Receipt is ready</h1>
        <p style="font-size:18px; line-height:1.6; max-width:640px;">${input.mantra}</p>
        <p><a href="${reportUrl}" style="display:inline-block; margin-top:18px; padding:14px 18px; border-radius:999px; background:#f6f0e8; color:#090a10; text-decoration:none;">Open my receipt</a></p>
        <p style="font-size:12px; color:#a69cad; margin-top:22px;">For entertainment and self-reflection only.</p>
      </div>
    `,
  });
}
