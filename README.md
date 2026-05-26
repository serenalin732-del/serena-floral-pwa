# Springdale Floral Next.js PWA

A Next.js/PWA prototype for a Pittsburgh neighborhood florist: modern public pages, AI custom bouquet flow, lightweight order dashboard, and email order template.

## Run locally

```bash
npm install
npm run dev
```

## Deploy target

Designed for future Cloudflare Pages deployment. For production, add Cloudflare Turnstile, D1/Supabase database, R2 image cache, and Resend/Postmark email.

## Current status

Prototype only. No real orders are sent and no real AI API is called yet. See `docs/database-and-ai.md` for production architecture, API recommendations, and anti-abuse controls.
