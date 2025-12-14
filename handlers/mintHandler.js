const { createMintEmbed, createErrorEmbed } = require('../utils/embedBuilder');

/**
 * Processes NFT mint events from Helius webhooks
 * @param {Object} webhookData - The webhook payload from Helius
 * @param {Object} discordClient - The Discord.js client instance
 * @param {string} channelId - The Discord channel ID to send notifications to
 */
async function handleMintEvent(webhookData, discordClient, channelId) {
    try {
        console.log('📦 Received webhook event:', JSON.stringify(webhookData, null, 2));

        // Get the Discord channel
        const channel = await discordClient.channels.fetch(channelId);
        if (!channel) {
            console.error('❌ Could not find Discord channel:', channelId);
            return;
        }

        // Handle different webhook formats
        // Helius sends an array of transactions
        const transactions = Array.isArray(webhookData) ? webhookData : [webhookData];

        for (const transaction of transactions) {
            // Extract relevant data from the transaction
            const mintData = parseMintData(transaction);

            if (!mintData) {
                console.log('⚠️ Could not parse mint data from transaction');
                continue;
            }

            // Create and send the embed
            const embed = createMintEmbed(mintData);
            await channel.send({ embeds: [embed] });

            console.log('✅ Sent mint notification to Discord');
        }
    } catch (error) {
        console.error('❌ Error handling mint event:', error);

        // Try to send error notification to Discord
        try {
            const channel = await discordClient.channels.fetch(channelId);
            const errorEmbed = createErrorEmbed(error.message);
            await channel.send({ embeds: [errorEmbed] });
        } catch (discordError) {
            console.error('❌ Could not send error to Discord:', discordError);
        }
    }
}

/**
 * Parses mint data from Helius webhook transaction
 * @param {Object} transaction - The transaction object from Helius
 * @returns {Object|null} Parsed mint data or null if invalid
 */
function parseMintData(transaction) {
    try {
        // Handle Enhanced Transaction format
        if (transaction.type === 'NFT_MINT' || transaction.type === 'COMPRESSED_NFT_MINT') {
            const nftData = transaction.events?.nft || {};
            const tokenTransfers = transaction.tokenTransfers || [];

            return {
                signature: transaction.signature,
                timestamp: transaction.timestamp,
                type: transaction.type,
                tokenTransfers: tokenTransfers,
                nftData: {
                    name: nftData.name,
                    symbol: nftData.symbol,
                    imageUrl: nftData.imageUrl || nftData.image,
                    description: nftData.description
                },
                accountData: transaction.accountData || [],
                feePayer: transaction.feePayer
            };
        }

        // Handle TOKEN_MINT type (for regular SPL tokens that might be NFTs)
        if (transaction.type === 'TOKEN_MINT') {
            const tokenTransfers = transaction.tokenTransfers || [];

            // Check if this is likely an NFT (supply = 1, decimals = 0)
            const isNFT = tokenTransfers.some(transfer =>
                transfer.tokenAmount === 1 || transfer.tokenAmount === '1'
            );

            if (!isNFT) {
                console.log('⚠️ TOKEN_MINT event but not an NFT (supply > 1)');
                return null;
            }

            return {
                signature: transaction.signature,
                timestamp: transaction.timestamp,
                type: 'NFT_MINT',
                tokenTransfers: tokenTransfers,
                nftData: {
                    name: tokenTransfers[0]?.mint || 'Unknown NFT',
                    symbol: '',
                    imageUrl: null
                },
                accountData: transaction.accountData || [],
                feePayer: transaction.feePayer
            };
        }

        // Handle raw transaction format (fallback)
        if (transaction.transaction) {
            const meta = transaction.meta || {};
            const postTokenBalances = meta.postTokenBalances || [];

            // Look for newly minted tokens (balance went from 0 to 1)
            const newMint = postTokenBalances.find(balance =>
                balance.uiTokenAmount?.uiAmount === 1 &&
                balance.uiTokenAmount?.decimals === 0
            );

            if (newMint) {
                return {
                    signature: transaction.signature,
                    timestamp: transaction.blockTime,
                    type: 'NFT_MINT',
                    tokenTransfers: [{
                        mint: newMint.mint
                    }],
                    nftData: {
                        name: newMint.mint,
                        symbol: '',
                        imageUrl: null
                    },
                    accountData: [],
                    feePayer: transaction.transaction?.message?.accountKeys?.[0]
                };
            }
        }

        console.log('⚠️ Unknown transaction format or not an NFT mint');
        return null;
    } catch (error) {
        console.error('❌ Error parsing mint data:', error);
        return null;
    }
}

module.exports = {
    handleMintEvent
};
