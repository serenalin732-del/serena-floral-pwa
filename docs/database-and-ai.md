# Floral PWA: Database, AI Image API, and Cost Controls

## Recommended image API

For this use case, prioritize cost control and speed over maximum photorealism. Recommended starting point:

1. **FAL.ai with FLUX Schnell / SDXL Lightning-style fast models** — usually cheaper and fast enough for customer inspiration previews. Good for the public builder.
2. **OpenAI image generation** — higher quality and better instruction following, but use only after account creation/payment or for staff/final previews.
3. **Replicate / Stability** — viable alternatives, but cost and model availability vary.

Best practical setup: free customer preview uses a cheap fast model; paid/registered or staff-enhanced preview can use a higher-quality model.

## Anti-abuse and cost controls

- One free generation per browser session + IP + device fingerprint window.
- Require email/phone verification for second generation.
- Add Turnstile CAPTCHA before any generation.
- Rate limit by IP, email/phone, user ID, and session.
- Queue generation jobs instead of direct button-to-API calls.
- Store prompt hash; if identical request repeats, return cached image.
- Use daily spend caps at the provider level.
- Use Cloudflare WAF/rate limiting on `/api/generate-preview`.
- Do not expose API keys in the browser; all calls go through server routes.

A Hermes skill can help generate *better prompts* and choose provider settings, but it will not by itself reduce provider cost for public website visitors. Cost reduction comes from caching, gating, rate limits, cheaper models, and provider spend caps.

## Core tables

### customers
- id
- first_name
- last_name
- email
- phone
- marketing_consent
- created_at
- last_seen_at

### orders
- id
- customer_id
- source: website | ai_builder | phone | funeral_home | fsn_import
- order_type: residential | funeral | b2b_funeral | walk_in
- status: new | needs_confirmation | accepted | designing | out_for_delivery | completed | cancelled
- budget_cents
- delivery_date
- delivery_zip
- recipient_name
- recipient_phone
- delivery_address
- funeral_home_name
- service_date_time
- card_message
- special_requests
- ai_preview_id
- created_at
- updated_at

### ai_previews
- id
- customer_id
- order_id
- prompt
- prompt_hash
- provider
- model
- image_url
- cost_cents_estimate
- generation_status
- created_at

### lead_events
- id
- customer_id
- session_id
- event_type: first_preview | gated_preview | save_design | submit_order | abandon
- metadata_json
- created_at

### email_logs
- id
- order_id
- recipient_email
- subject
- body_html
- provider_message_id
- status
- created_at

## Cloudflare stack suggestion

- Cloudflare Pages for the Next.js app.
- Cloudflare Turnstile for abuse prevention.
- Cloudflare D1 for lightweight order/customer data at first, or Supabase if you want a richer admin experience.
- Cloudflare R2 for generated image storage/cache.
- Resend/Postmark for transactional order emails.
- Later: mature florist POS integration if selected.
