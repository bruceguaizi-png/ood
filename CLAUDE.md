@AGENTS.md

## Deploy

- Platform: Vercel
- Production domain: `https://oracleood.com`
- Health check: `GET /api/health`
- Local sync: `vercel pull --yes --environment=development`
- Production deploy: `vercel --prod`

## Environment Variables

- Required for production checkout: `NEXT_PUBLIC_APP_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_MANIFEST_PRICE_ID`
- Required for auth and profile flows: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Required for email delivery: `RESEND_API_KEY`, `RESEND_FROM`
- Required for bot protection in production: `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- Optional analytics: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`
- Optional AI generation: `AI_PROVIDER`, `AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL`, `AI_TEMPERATURE`

## Production Note

- The current order/session/report store writes to the local filesystem. On Vercel that means writable `/tmp` scratch space only, so this is suitable for beta/demo traffic but not durable production persistence.
