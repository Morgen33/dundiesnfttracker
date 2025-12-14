# Render.com Free Deployment Guide

## Deploy to Render.com (100% FREE)

Render offers a **free tier** that's perfect for Discord bots. No credit card required!

### Step 1: Create Render Account

1. Go to https://render.com
2. Click "Get Started" 
3. Sign up with GitHub (easiest option)

### Step 2: Push Code to GitHub

```bash
# Create a new repository on GitHub first, then:
cd /Users/mo/.gemini/antigravity/scratch/nft-mint-tracker
git remote add origin https://github.com/YOUR_USERNAME/nft-mint-tracker.git
git branch -M main
git push -u origin main
```

### Step 3: Create Web Service on Render

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Click **"Connect GitHub"** and authorize Render
3. Select your `nft-mint-tracker` repository
4. Fill in the settings:

   **Basic Settings:**
   - **Name**: `nft-mint-tracker` (or whatever you want)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`

   **Instance Type:**
   - Select **"Free"** (0.1 CPU, 512 MB RAM)

5. Click **"Advanced"** and add environment variables:

   ```
   DISCORD_BOT_TOKEN=your_discord_bot_token_here
   DISCORD_CHANNEL_ID=your_channel_id_here
   HELIUS_API_KEY=your_helius_api_key_here
   PORT=10000
   ```

   **Note:** Render uses port 10000 by default for free tier

6. Click **"Create Web Service"**

### Step 4: Wait for Deployment

- Render will automatically build and deploy your bot
- Watch the logs in the dashboard
- You'll see "Your service is live 🎉" when ready
- Copy your service URL (e.g., `https://nft-mint-tracker.onrender.com`)

### Step 5: Update Helius Webhook

Update your webhook with the new Render URL:

```bash
curl -X PUT "https://api.helius.xyz/v0/webhooks/14e57234-2599-492e-973e-ca6104583f63?api-key=ff60ae79-8cac-40dd-bd6d-2129ea6fac08" \
  -H "Content-Type: application/json" \
  -d '{
    "webhookURL": "https://YOUR-APP-NAME.onrender.com/webhook"
  }'
```

Replace `YOUR-APP-NAME` with your actual Render service name.

### Step 6: Test It!

1. Check Render logs to see bot is online
2. Test health endpoint: `https://YOUR-APP-NAME.onrender.com/health`
3. Use `/start` command in Discord
4. Wait for next NFT mint!

---

## Render Free Tier Details

✅ **Completely FREE** - No credit card required  
✅ **750 hours/month** - Enough to run 24/7  
✅ **512 MB RAM** - Perfect for this bot  
✅ **Automatic deploys** - Push to GitHub = auto deploy  
✅ **Free SSL** - HTTPS included  
✅ **Persistent URL** - Never changes  

⚠️ **Important:** Free tier services **spin down after 15 minutes of inactivity**. They wake up when a request comes in (takes ~30 seconds). This is fine for NFT tracking since Helius will wake it up when sending webhooks.

---

## Keep Your Bot Awake (Optional)

If you want to prevent spin-down, you can:

**Option 1: Use a free uptime monitor**
- https://uptimerobot.com (free)
- Ping your health endpoint every 14 minutes
- Keeps bot always awake

**Option 2: Self-ping (add to your code)**
Add this to `index.js` after the server starts:

```javascript
// Keep alive on Render free tier
if (process.env.RENDER) {
  setInterval(() => {
    const url = process.env.RENDER_EXTERNAL_URL || 'http://localhost:3001';
    fetch(`${url}/health`).catch(() => {});
  }, 14 * 60 * 1000); // Every 14 minutes
}
```

---

## Monitoring

**View Logs:**
- Go to Render dashboard → Your service → "Logs" tab
- See real-time logs of your bot

**Check Status:**
- Dashboard shows if service is running
- Use `/start` command in Discord
- Check `https://YOUR-APP-NAME.onrender.com/health`

**Redeploy:**
- Push to GitHub = automatic redeploy
- Or click "Manual Deploy" in Render dashboard

---

## Troubleshooting

**Service won't start:**
- Check logs for errors
- Verify environment variables are set
- Make sure PORT is set to 10000

**Bot offline after 15 min:**
- This is normal for free tier
- Bot wakes up when webhook arrives
- Use uptime monitor to keep it awake

**Webhook not working:**
- Verify URL in Helius dashboard
- Check Render logs for incoming requests
- Test with: `curl https://YOUR-APP-NAME.onrender.com/health`

---

## Upgrading (If Needed)

If you need guaranteed uptime without spin-down:
- **Starter Plan**: $7/month
- Keeps service always running
- More resources

But the free tier should work fine for NFT tracking!

---

## Alternative Free Options

If Render doesn't work for you:

1. **Fly.io** - Free tier with 3 VMs
2. **Cyclic.sh** - Free for small apps
3. **Glitch.com** - Free with auto-sleep
4. **Replit** - Free with Always On (paid feature)

---

## Next Steps

1. ✅ Create GitHub repository
2. ✅ Push code to GitHub
3. ✅ Deploy on Render
4. ✅ Update Helius webhook
5. ✅ Test with `/start` command
6. ✅ Wait for NFT mints!
