import { z } from "zod";

export const intakeSchema = z.object({
  name: z.string().trim().min(1),
  birthDate: z.string().min(1),
  birthTime: z.string().trim().optional(),
  birthCity: z.string().trim().optional(),
  consentEntertainmentDisclaimer: z.literal(true),
  turnstileToken: z.string().optional(),
});

export const intakeRegisterSchema = z.object({
  sessionId: z.string().min(1),
  email: z.string().email(),
  turnstileToken: z.string().optional(),
});

export const checkoutSchema = z.object({
  intakeSessionId: z.string().min(1),
  email: z.string().email(),
  skuCode: z.enum([
    "crossover-relationship",
    "crossover-career",
    "crossover-money",
    "crossover-healing",
    "crossover-bundle",
    "signal-wallpaper",
  ]),
  turnstileToken: z.string().optional(),
});

export const generateReportSchema = z.object({
  orderId: z.string().min(1).optional(),
  sessionId: z.string().min(1).optional(),
}).refine((value) => value.orderId || value.sessionId, {
  message: "orderId or sessionId is required",
});
