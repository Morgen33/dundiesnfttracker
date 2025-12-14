# NFT Mint Tracker Bot

A Discord bot that monitors and reports NFT mints on Solana in real-time using Helius webhooks.

## Features

- 🎨 **Real-time NFT mint tracking** on Solana blockchain
- 🔔 **Discord notifications** with rich embeds
- 📦 **Support for both regular and compressed NFTs** (cNFTs)
- 🎯 **Optional filtering** by collection or creator address
- 🚀 **Easy deployment** with multiple hosting options

## Prerequisites

Before you begin, you'll need:

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **Helius API Key** - [Sign up at helius.dev](https://helius.dev)
3. **Discord Bot Token** - [Create a bot](https://discord.com/developers/applications)
4. **Discord Channel ID** - Where mint notifications will be sent

## Quick Start

### 1. Installation

```bash
# Clone or download this project
cd nft-mint-tracker

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` and fill in your credentials:

```env
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_CHANNEL_ID=your_channel_id_here
HELIUS_API_KEY=your_helius_api_key_here
PORT=3000
WEBHOOK_SECRET=your_random_secret_here
```

### 3. Create Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to "Bot" section and click "Add Bot"
4. Copy the bot token to your `.env` file
5. Enable these **Privileged Gateway Intents**:
   - Server Members Intent
   - Message Content Intent
6. Go to "OAuth2" → "URL Generator"
7. Select scopes: `bot`
8. Select permissions: `Send Messages`, `Embed Links`
9. Copy the generated URL and invite the bot to your server

### 4. Get Discord Channel ID

1. Enable Developer Mode in Discord (User Settings → Advanced → Developer Mode)
2. Right-click the channel where you want notifications
3. Click "Copy Channel ID"
4. Paste it into your `.env` file

### 5. Run the Bot

```bash
npm start
```

You should see:
```
✅ Discord bot is online!
📱 Logged in as YourBot#1234
🚀 Webhook server listening on port 3000
✅ Successfully sent test message to Discord channel
```

## Setting Up Helius Webhooks

After your bot is running, you need to configure Helius to send mint events to your webhook endpoint.

### Option A: Using ngrok (for local development)

1. Install ngrok: `brew install ngrok` (Mac) or [download](https://ngrok.com/download)
2. Run ngrok: `ngrok http 3000`
3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
4. Use this URL + `/webhook` as your webhook endpoint

### Option B: Deploy to Cloud (recommended for production)

Deploy to platforms like:
- **Railway** - [railway.app](https://railway.app)
- **Render** - [render.com](https://render.com)
- **Heroku** - [heroku.com](https://heroku.com)
- **DigitalOcean** - [digitalocean.com](https://digitalocean.com)

### Create Webhook in Helius Dashboard

1. Go to [Helius Dashboard](https://dev.helius.xyz/dashboard/app)
2. Navigate to "Webhooks" section
3. Click "Create Webhook"
4. Configure:
   - **Webhook URL**: `https://your-domain.com/webhook`
   - **Webhook Type**: Enhanced Transaction
   - **Transaction Types**: Select `NFT_MINT` and/or `COMPRESSED_NFT_MINT`
   - **Network**: Mainnet or Devnet
   - **Account Addresses** (optional): Add specific collection/creator addresses to monitor

### Create Webhook via API

Alternatively, use the Helius API:

```bash
curl -X POST "https://api.helius.xyz/v0/webhooks?api-key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "webhookURL": "https://your-domain.com/webhook",
    "transactionTypes": ["NFT_MINT", "COMPRESSED_NFT_MINT"],
    "accountAddresses": [],
    "webhookType": "enhanced"
  }'
```

## Configuration Options

### Monitor Specific Collections

To track only specific NFT collections, add the collection address to your `.env`:

```env
COLLECTION_ADDRESS=YourCollectionAddressHere
```

Then add this address to the `accountAddresses` array when creating your Helius webhook.

### Webhook Security

For production, set a webhook secret:

```env
WEBHOOK_SECRET=your_random_secret_string_here
```

Then include it in your Helius webhook requests as a header:
```
X-Webhook-Secret: your_random_secret_string_here
```

## Testing

### Test Webhook Endpoint

```bash
# Check if server is running
curl http://localhost:3000/health

# Test webhook with sample data
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "NFT_MINT",
    "signature": "test123",
    "timestamp": 1234567890,
    "tokenTransfers": [{"mint": "TestMintAddress"}]
  }'
```

### Monitor Logs

The bot provides detailed logging:
- ✅ Success messages
- ❌ Error messages
- 📦 Webhook events received
- 📨 Discord notifications sent

## Troubleshooting

### Bot doesn't come online
- Verify your `DISCORD_BOT_TOKEN` is correct
- Check that you've enabled the required intents in Discord Developer Portal

### Can't send messages to channel
- Verify `DISCORD_CHANNEL_ID` is correct
- Ensure the bot has permissions to send messages in that channel
- Check that you've invited the bot to your server

### Not receiving mint notifications
- Verify your webhook is publicly accessible (use ngrok for local testing)
- Check Helius Dashboard for webhook delivery status
- Review bot logs for any errors
- Test the webhook endpoint manually with curl

### Webhook returns 401 Unauthorized
- Check that `WEBHOOK_SECRET` matches in both `.env` and Helius webhook configuration

## Project Structure

```
nft-mint-tracker/
├── index.js                 # Main application file
├── handlers/
│   └── mintHandler.js      # Processes mint events
├── utils/
│   └── embedBuilder.js     # Creates Discord embeds
├── package.json            # Dependencies
├── .env.example            # Environment template
└── README.md              # This file
```

## Advanced Usage

### Custom Embed Styling

Edit `utils/embedBuilder.js` to customize the appearance of Discord notifications:
- Change colors
- Add/remove fields
- Modify formatting

### Multiple Collections

To track multiple collections, modify the webhook handler to filter based on creator addresses or collection metadata.

### Database Integration

Add a database (MongoDB, PostgreSQL) to:
- Store mint history
- Track statistics
- Prevent duplicate notifications

## Resources

- [Helius Documentation](https://docs.helius.dev)
- [Discord.js Guide](https://discordjs.guide)
- [Solana Explorer](https://solscan.io)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Helius webhook logs in their dashboard
3. Check bot console logs for errors

## License

MIT
