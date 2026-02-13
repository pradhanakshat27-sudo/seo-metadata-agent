# SEO Metadata Agent

React + TypeScript + Vite frontend for the n8n SEO Metadata Agent workflow. Scrapes webpage metadata and generates 3 AI-optimized SEO variations (Urgency, Benefits, Social Proof).

## Prerequisites

- Node.js 18+
- n8n running locally on port 5678 with the `seo-metadata-agent` workflow **Active**

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. (Optional) Edit .env.local if n8n runs on a different port
# N8N_URL=http://localhost:YOUR_PORT

# 4. Start the dev server
npm run dev
```

Open http://localhost:5173

## How It Works

The Vite dev server proxies all `/webhook/*` requests to n8n (`N8N_URL`). This avoids CORS without any n8n configuration changes — the browser only ever talks to `localhost:5173`.

## n8n Configuration

- Workflow must be **Active** (toggle in top-right of n8n workflow editor)
- Production webhook URL: `http://localhost:5678/webhook/seo-metadata-agent`
- Do NOT use "Execute Workflow" button (one-time only)

## Production Deployment

```bash
# Set VITE_API_URL to your public n8n URL before building
VITE_API_URL=https://your-n8n-instance.com npm run build
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS error | Check request goes to `localhost:5173` (not 5678) in Network tab |
| "Webhook not found" (404) | Activate the workflow in n8n UI |
| No response / timeout | Ensure n8n is running; check Gemini API quotas |
| Copy button does nothing | Requires localhost or HTTPS; check browser console |
