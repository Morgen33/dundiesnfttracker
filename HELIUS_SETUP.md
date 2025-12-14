# Helius Webhook Setup Guide

This guide provides detailed instructions for configuring Helius webhooks to track NFT mints.

## Overview

Helius webhooks allow you to receive real-time notifications when specific events occur on the Solana blockchain. For NFT mint tracking, we'll use **Enhanced Transaction Webhooks** which provide parsed, human-readable data.

## Webhook Types

Helius offers several webhook types:

- **Enhanced Transaction Webhooks** ✅ (Recommended)
  - Provides parsed, human-readable transaction data
  - Automatically decodes NFT mints, transfers, and sales
  - Filters by transaction type (NFT_MINT, COMPRESSED_NFT_MINT, etc.)

- **Raw Transaction Webhooks**
  - Provides raw transaction data
  - Requires manual parsing
  - More flexible but more complex

- **Discord Webhooks**
  - Sends notifications directly to Discord
  - Limited customization

For this bot, we use **Enhanced Transaction Webhooks** for the best balance of ease-of-use and functionality.

## Creating a Webhook via Dashboard

### Step 1: Access Helius Dashboard

1. Go to [https://dev.helius.xyz/dashboard/app](https://dev.helius.xyz/dashboard/app)
2. Sign in or create an account
3. Navigate to the "Webhooks" section

### Step 2: Create New Webhook

1. Click "Create Webhook" or "New Webhook"
2. Fill in the configuration:

   **Basic Settings:**
   - **Webhook URL**: Your public endpoint (e.g., `https://your-domain.com/webhook`)
   - **Webhook Type**: Select "Enhanced"
   - **Network**: Choose "Mainnet" or "Devnet"

   **Transaction Types:**
   - Select `NFT_MINT` for regular NFT mints
   - Select `COMPRESSED_NFT_MINT` for compressed NFT mints
   - You can select both to track all NFT types

   **Account Addresses (Optional):**
   - Leave empty to track ALL NFT mints on Solana
   - Add specific addresses to filter:
     - Collection mint addresses
     - Creator wallet addresses
     - Update authority addresses
     - Merkle tree addresses (for cNFTs)

3. Click "Create" to save the webhook

### Step 3: Test the Webhook

1. After creation, you'll see your webhook in the dashboard
2. Click "Test" to send a sample event
3. Verify your bot receives and processes the test event
4. Check the "Delivery History" for status and errors

## Creating a Webhook via API

You can also create webhooks programmatically using the Helius API.

### Basic NFT Mint Webhook

```bash
curl -X POST "https://api.helius.xyz/v0/webhooks?api-key=YOUR_HELIUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "webhookURL": "https://your-domain.com/webhook",
    "transactionTypes": ["NFT_MINT", "COMPRESSED_NFT_MINT"],
    "accountAddresses": [],
    "webhookType": "enhanced",
    "txnStatus": "all"
  }'
```

### Track Specific Collection

```bash
curl -X POST "https://api.helius.xyz/v0/webhooks?api-key=YOUR_HELIUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "webhookURL": "https://your-domain.com/webhook",
    "transactionTypes": ["NFT_MINT"],
    "accountAddresses": ["YourCollectionMintAddress"],
    "webhookType": "enhanced",
    "txnStatus": "all"
  }'
```

### Using Node.js

```javascript
const axios = require('axios');

async function createHeliusWebhook() {
  const response = await axios.post(
    `https://api.helius.xyz/v0/webhooks?api-key=${process.env.HELIUS_API_KEY}`,
    {
      webhookURL: 'https://your-domain.com/webhook',
      transactionTypes: ['NFT_MINT', 'COMPRESSED_NFT_MINT'],
      accountAddresses: [], // Empty = track all mints
      webhookType: 'enhanced',
      txnStatus: 'all'
    }
  );
  
  console.log('Webhook created:', response.data);
  return response.data;
}

createHeliusWebhook();
```

## Webhook Payload Format

When an NFT mint occurs, Helius will send a POST request to your webhook URL with this format:

### Enhanced Transaction Format

```json
[
  {
    "type": "NFT_MINT",
    "signature": "5j7s6NiJS3JAkvgkoc18WVAsiSaci2pxB2A6ueCJP4tprA2u89z13MEZCQANf8j1Ed7njhCrPDgKftu9ZB3FU2xQ",
    "timestamp": 1234567890,
    "slot": 123456789,
    "feePayer": "7UX2i7SucgLMQcfZ75s3VXmZZY4YRUyJN9X1RgfMoDUi",
    "tokenTransfers": [
      {
        "mint": "TokenMintAddress123...",
        "tokenAmount": 1,
        "fromUserAccount": "",
        "toUserAccount": "RecipientAddress123...",
        "fromTokenAccount": "",
        "toTokenAccount": "TokenAccountAddress123..."
      }
    ],
    "events": {
      "nft": {
        "name": "Cool NFT #123",
        "symbol": "COOL",
        "imageUrl": "https://arweave.net/...",
        "description": "A cool NFT"
      }
    },
    "accountData": [
      {
        "account": "CreatorAddress123...",
        "nativeBalanceChange": -5000,
        "tokenBalanceChanges": []
      }
    ]
  }
]
```

## Managing Webhooks

### List All Webhooks

```bash
curl "https://api.helius.xyz/v0/webhooks?api-key=YOUR_HELIUS_API_KEY"
```

### Get Webhook Details

```bash
curl "https://api.helius.xyz/v0/webhooks/WEBHOOK_ID?api-key=YOUR_HELIUS_API_KEY"
```

### Update Webhook

```bash
curl -X PUT "https://api.helius.xyz/v0/webhooks/WEBHOOK_ID?api-key=YOUR_HELIUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "webhookURL": "https://new-domain.com/webhook",
    "transactionTypes": ["NFT_MINT"]
  }'
```

### Delete Webhook

```bash
curl -X DELETE "https://api.helius.xyz/v0/webhooks/WEBHOOK_ID?api-key=YOUR_HELIUS_API_KEY"
```

## Advanced Filtering

### Track Multiple Collections

```json
{
  "webhookURL": "https://your-domain.com/webhook",
  "transactionTypes": ["NFT_MINT"],
  "accountAddresses": [
    "Collection1MintAddress",
    "Collection2MintAddress",
    "Collection3MintAddress"
  ],
  "webhookType": "enhanced"
}
```

### Track Specific Creator

```json
{
  "webhookURL": "https://your-domain.com/webhook",
  "transactionTypes": ["NFT_MINT"],
  "accountAddresses": ["CreatorWalletAddress"],
  "webhookType": "enhanced"
}
```

### Track Compressed NFTs Only

```json
{
  "webhookURL": "https://your-domain.com/webhook",
  "transactionTypes": ["COMPRESSED_NFT_MINT"],
  "accountAddresses": ["MerkleTreeAddress"],
  "webhookType": "enhanced"
}
```

## Monitoring & Debugging

### Check Webhook Status

In the Helius Dashboard:
1. Go to "Webhooks"
2. Click on your webhook
3. View "Delivery History"
4. Check success/failure rates
5. Review error messages

### Common Issues

**Webhook not receiving events:**
- Verify webhook URL is publicly accessible
- Check that transaction types are correctly configured
- Ensure account addresses (if specified) are correct
- Review Helius delivery logs for errors

**401/403 Errors:**
- Verify webhook secret matches
- Check authentication headers

**500 Errors:**
- Review your server logs
- Ensure your endpoint can handle the payload
- Check for parsing errors

### Testing with ngrok

For local development:

```bash
# Start your bot
npm start

# In another terminal, start ngrok
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Use this URL + /webhook in Helius Dashboard
```

## Rate Limits

Helius webhooks have the following limits:

- **Free Tier**: Limited webhook calls per month
- **Paid Tiers**: Higher limits based on plan
- **Delivery**: Helius will retry failed webhooks with exponential backoff

Check your current plan limits in the Helius Dashboard.

## Best Practices

1. **Use HTTPS**: Always use HTTPS for webhook URLs in production
2. **Validate Payloads**: Verify webhook signatures/secrets
3. **Handle Errors**: Implement proper error handling and logging
4. **Respond Quickly**: Return 200 OK as fast as possible (process async if needed)
5. **Monitor Delivery**: Regularly check webhook delivery status in dashboard
6. **Filter Wisely**: Use account addresses to reduce unnecessary webhook calls
7. **Test Thoroughly**: Use ngrok for local testing before deploying

## Security

### Webhook Secret

Add a secret to verify webhook authenticity:

1. Generate a random secret: `openssl rand -hex 32`
2. Add to your `.env`: `WEBHOOK_SECRET=your_secret_here`
3. Include in webhook requests as header: `X-Webhook-Secret: your_secret_here`
4. Verify in your webhook handler (already implemented in `index.js`)

### IP Whitelisting

Consider whitelisting Helius IP addresses in your firewall for additional security.

## Resources

- [Helius Webhooks Documentation](https://docs.helius.dev/webhooks-and-websockets/webhooks)
- [Helius API Reference](https://docs.helius.dev/api-reference/webhooks)
- [Transaction Types Reference](https://docs.helius.dev/webhooks-and-websockets/webhook-types)
- [Helius Discord](https://discord.gg/helius) - Community support

## Support

If you encounter issues:
1. Check the Helius Dashboard delivery logs
2. Review your bot's console logs
3. Test with curl/Postman
4. Contact Helius support via Discord or email
