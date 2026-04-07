import { z } from "zod";

export const intakeSchema = z.object({
  name: z.string().trim().min(1),
  birthDate: z.string().min(1),
  birthTime: z.string().trim().optional(),
  birthCity: z.string().trim().optional(),
  consentEntertainmentDisclaimer: z.literal(true),
  email: z.string().email().optional(),
  turnstileToken: z.string().optional(),
});

export const checkoutSchema = z.object({
  intakeSessionId: z.string().min(1),
  email: z.string().email(),
  turnstileToken: z.string().optional(),
});

export const generateReportSchema = z.object({
  orderId: z.string().min(1),
});
