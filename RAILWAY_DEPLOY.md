# Railway Deployment Guide

## Quick Deploy to Railway (5 minutes)

### Step 1: Prepare Your Code

First, initialize a git repository if you haven't already:

```bash
cd /Users/mo/.gemini/antigravity/scratch/nft-mint-tracker
git init
git add .
git commit -m "Initial commit - NFT mint tracker bot"
```

### Step 2: Create Railway Account

1. Go to https://railway.app
2. Click "Login" and sign up with GitHub
3. Authorize Railway to access your GitHub account

### Step 3: Deploy Your Bot

**Option A: Deploy from Local Directory (Easiest)**

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Initialize and deploy:
   ```bash
   railway init
   railway up
   ```

4. The CLI will give you a deployment URL (e.g., `https://your-app.up.railway.app`)

**Option B: Deploy from GitHub**

1. Push your code to GitHub:
   ```bash
   # Create a new repo on GitHub first, then:
   git remote add origin https://github.com/yourusername/nft-mint-tracker.git
   git branch -M main
   git push -u origin main
   ```

2. In Railway dashboard:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect it's a Node.js app

### Step 4: Set Environment Variables

In Railway dashboard:

1. Click on your project
2. Go to "Variables" tab
3. Add these variables:
   ```
   DISCORD_BOT_TOKEN=your_discord_bot_token_here
   DISCORD_CHANNEL_ID=your_channel_id_here
   HELIUS_API_KEY=your_helius_api_key_here
   PORT=3001
   ```

4. Click "Deploy" to restart with new variables

### Step 5: Get Your Deployment URL

1. In Railway dashboard, go to "Settings" tab
2. Click "Generate Domain" under "Domains"
3. Copy your public URL (e.g., `https://nft-mint-tracker-production.up.railway.app`)

### Step 6: Update Helius Webhook

Now update your Helius webhook with the permanent Railway URL:

```bash
# First, get your webhook ID
curl "https://api.helius.xyz/v0/webhooks?api-key=ff60ae79-8cac-40dd-bd6d-2129ea6fac08"

# Then update it (replace WEBHOOK_ID and YOUR_RAILWAY_URL)
curl -X PUT "https://api.helius.xyz/v0/webhooks/14e57234-2599-492e-973e-ca6104583f63?api-key=ff60ae79-8cac-40dd-bd6d-2129ea6fac08" \
  -H "Content-Type: application/json" \
  -d '{
    "webhookURL": "https://YOUR_RAILWAY_URL.up.railway.app/webhook"
  }'
```

### Step 7: Verify Deployment

1. Check Railway logs to see if bot is online
2. Test the health endpoint: `https://YOUR_RAILWAY_URL.up.railway.app/health`
3. Use `/start` command in Discord to verify bot is running

---

## Railway Features

✅ **Free Tier**: $5 free credit per month (enough for this bot)  
✅ **Auto-deploys**: Pushes to GitHub trigger automatic deployments  
✅ **Persistent URL**: Your URL never changes  
✅ **24/7 uptime**: Bot runs continuously  
✅ **Easy logs**: View logs in Railway dashboard  
✅ **Environment variables**: Secure credential management  

---

## Costs

- **Free tier**: $5/month credit (usually enough for small bots)
- **If you exceed**: ~$0.000463/GB-hour for memory usage
- **Estimated cost**: $2-5/month for this bot

---

## Monitoring Your Bot

**View Logs:**
```bash
railway logs
```

**Check Status:**
- Railway dashboard shows deployment status
- Use `/start` command in Discord
- Check health endpoint: `https://your-url.up.railway.app/health`

**Redeploy:**
```bash
railway up
```

---

## Troubleshooting

**Bot not starting:**
- Check Railway logs for errors
- Verify environment variables are set correctly
- Ensure PORT is set to match Railway's expectations

**Webhook not receiving events:**
- Verify webhook URL in Helius dashboard
- Check Railway logs for incoming requests
- Test with curl to your Railway URL

**Bot goes offline:**
- Check Railway credits/billing
- View logs for crash errors
- Verify Discord token is still valid

---

## Alternative: Render.com

If you prefer Render over Railway:

1. Go to https://render.com
2. Create "New Web Service"
3. Connect GitHub repo
4. Set environment variables
5. Deploy

Render also has a free tier and is very similar to Railway.

---

## Next Steps After Deployment

1. ✅ Remove ngrok (no longer needed)
2. ✅ Update Helius webhook with Railway URL
3. ✅ Monitor Railway dashboard for first few mints
4. ✅ Set up GitHub for automatic deployments
5. ✅ Consider upgrading Railway plan if needed
