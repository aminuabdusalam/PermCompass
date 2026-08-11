# PermCompass Assessment Worker — Setup

A tiny Cloudflare Worker that proxies self-sponsorship readiness assessments from the PermCompass PWA to Azure OpenAI. Your API key lives as a Worker secret; nothing sensitive touches the browser.

## Prereqs

- A Cloudflare account (free tier is fine)
- Node 18+ locally
- An Azure OpenAI resource with a chat-capable deployment (e.g., `gpt-4o-mini`, `gpt-4o`)

## 5-minute deploy

```powershell
cd C:\Users\aabdusalam\personal\PermCompass\worker

# 1. Install wrangler
npm install -g wrangler

# 2. Log in to Cloudflare
wrangler login

# 3. Set the four Azure OpenAI secrets (each command prompts for the value)
wrangler secret put AZURE_OPENAI_ENDPOINT
# paste: https://<your-resource>.openai.azure.com

wrangler secret put AZURE_OPENAI_DEPLOYMENT
# paste: your chat deployment name, e.g. gpt-4o-mini

wrangler secret put AZURE_OPENAI_API_VERSION
# paste: 2024-08-01-preview  (or the version your resource supports)

wrangler secret put AZURE_OPENAI_KEY
# paste: your Azure OpenAI API key

# 4. Deploy
wrangler deploy
```

Wrangler prints the Worker URL, e.g. `https://permcompass-assess.<your-subdomain>.workers.dev`. Copy it.

## Wire the client to the Worker

Open `index.html` and set `ASSESSMENT_ENDPOINT` to the URL you copied:

```js
// near the top of the assessment IIFE
var ASSESSMENT_ENDPOINT = 'https://permcompass-assess.<your-subdomain>.workers.dev';
```

Commit and push. GitHub Pages will republish and the "Assess" tab will start working.

## Local testing

```powershell
# In one terminal — run the worker locally
cd worker
wrangler dev
# it prints something like http://127.0.0.1:8787

# In another terminal — serve the PWA
cd ..
python -m http.server 5173

# Temporarily point ASSESSMENT_ENDPOINT at http://127.0.0.1:8787 in index.html
# Then open http://localhost:5173 in a browser.
```

## Safety notes baked into the Worker

- Origin allow-list (`ALLOWED_ORIGINS` in `wrangler.toml`)
- 12 KB max input size
- Strict JSON response format enforced with `response_format: json_object`
- Model deployment locked to the value of `AZURE_OPENAI_DEPLOYMENT` — clients cannot override it
- No user text logged to Cloudflare (Worker doesn't write logs unless you add them)

## Cost

Cloudflare Workers free tier: 100,000 requests/day. Azure OpenAI usage is metered per token; a single assessment on `gpt-4o-mini` is typically ~$0.001-$0.003.

## Rotating the key

```powershell
wrangler secret put AZURE_OPENAI_KEY
```

Overwrites the existing secret. No redeploy needed.
