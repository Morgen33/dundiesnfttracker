# Quick Helius Webhook Setup

Your bot is running! Now you need to connect it to Helius so it can receive real NFT mint events.

## Problem
Your bot is running locally on `http://localhost:3001/webhook`, but Helius can't reach localhost - it needs a **public URL**.

## Solution: Use ngrok (Free & Easy)

### Step 1: Install ngrok
```bash
brew install ngrok
```

### Step 2: Start ngrok
In a **new terminal window** (keep your bot running), run:
```bash
ngrok http 3001
```

You'll see output like:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3001
```

**Copy that HTTPS URL** (e.g., `https://abc123.ngrok.io`)

### Step 3: Create Helius Webhook

**Option A: Via Helius Dashboard (Easiest)**
1. Go to https://dev.helius.xyz/dashboard/app
2. Click "Webhooks" in sidebar
3. Click "Create Webhook"
4. Fill in:
   - **Webhook URL**: `https://abc123.ngrok.io/webhook` (your ngrok URL + /webhook)
   - **Webhook Type**: Enhanced
   - **Transaction Types**: Check `NFT_MINT` and `COMPRESSED_NFT_MINT`
   - **Network**: Mainnet (or Devnet for testing)
   - **Account Addresses**: Leave empty to track ALL mints, or add specific collection addresses
5. Click "Create"

**Option B: Via API**
```bash
curl -X POST "https://api.helius.xyz/v0/webhooks?api-key=YOUR_HELIUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "webhookURL": "https://abc123.ngrok.io/webhook",
    "transactionTypes": ["NFT_MINT", "COMPRESSED_NFT_MINT"],
    "accountAddresses": [],
    "webhookType": "enhanced"
  }'
```

Replace:
- `YOUR_HELIUS_API_KEY` with your actual API key
- `https://abc123.ngrok.io/webhook` with your ngrok URL

### Step 4: Test It!
Once the webhook is created, wait for the next NFT mint on Solana and you'll see it in Discord! 🎉

---

## For Production (Deploy to Cloud)

For a permanent solution, deploy to:
- **Railway**: https://railway.app (easiest)
- **Render**: https://render.com
- **Heroku**: https://heroku.com

Then use your deployment URL instead of ngrok.

---

## Troubleshooting

**Not receiving mints?**
1. Check ngrok is still running
2. Verify webhook URL in Helius Dashboard
3. Check bot logs for errors
4. Test with the curl command to verify bot is working

**ngrok URL changed?**
- Free ngrok URLs change every time you restart
- Update the webhook URL in Helius Dashboard
- Or upgrade to ngrok paid for static URLs
