const { EmbedBuilder } = require('discord.js');

/**
 * Creates a rich Discord embed for NFT mint notifications
 * @param {Object} mintData - The mint data from Helius webhook
 * @returns {EmbedBuilder} Discord embed object
 */
function createMintEmbed(mintData) {
  const {
    signature,
    timestamp,
    tokenTransfers,
    nftData,
    accountData,
    type
  } = mintData;

  // Extract mint address and metadata
  const mintAddress = tokenTransfers?.[0]?.mint || 'Unknown';
  const nftName = nftData?.name || 'Unknown NFT';
  const nftSymbol = nftData?.symbol || '';
  const nftImage = nftData?.imageUrl || nftData?.image || null;
  const creator = accountData?.[0]?.account || 'Unknown';

  // Create the embed
  const embed = new EmbedBuilder()
    .setColor('#9945FF') // Solana purple
    .setTitle(`🎨 New NFT Minted!`)
    .setDescription(`**${nftName}** ${nftSymbol ? `(${nftSymbol})` : ''}`)
    .addFields(
      {
        name: '🏷️ Mint Address',
        value: `\`${mintAddress}\``,
        inline: false
      },
      {
        name: '👤 Creator',
        value: `\`${creator.substring(0, 20)}...${creator.substring(creator.length - 10)}\``,
        inline: false
      },
      {
        name: '🔗 Links',
        value: [
          `[View on Solscan](https://solscan.io/token/${mintAddress})`,
          `[View Transaction](https://solscan.io/tx/${signature})`
        ].join(' • '),
        inline: false
      }
    )
    .setTimestamp(timestamp ? new Date(timestamp * 1000) : new Date())
    .setFooter({ text: `Signature: ${signature.substring(0, 20)}...` });

  // Add image if available
  if (nftImage) {
    embed.setImage(nftImage); // Full-size image instead of thumbnail
  }

  // Add type indicator for compressed NFTs
  if (type === 'COMPRESSED_NFT_MINT') {
    embed.addFields({
      name: '📦 Type',
      value: 'Compressed NFT (cNFT)',
      inline: true
    });
  }

  return embed;
}

/**
 * Creates a simple embed for webhook test/health check
 * @returns {EmbedBuilder} Discord embed object
 */
function createTestEmbed() {
  return new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle('✅ Webhook Test Successful')
    .setDescription('Your NFT mint tracker is now active and listening for mints!')
    .setTimestamp();
}

/**
 * Creates an error embed
 * @param {string} errorMessage - The error message to display
 * @returns {EmbedBuilder} Discord embed object
 */
function createErrorEmbed(errorMessage) {
  return new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle('❌ Error Processing Mint')
    .setDescription(errorMessage)
    .setTimestamp();
}

module.exports = {
  createMintEmbed,
  createTestEmbed,
  createErrorEmbed
};
