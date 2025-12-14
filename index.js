require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');
const express = require('express');
const { handleMintEvent } = require('./handlers/mintHandler');
const { createTestEmbed } = require('./utils/embedBuilder');

// Validate environment variables
const requiredEnvVars = ['DISCORD_BOT_TOKEN', 'DISCORD_CHANNEL_ID', 'HELIUS_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
    console.error('Please copy .env.example to .env and fill in your values');
    process.exit(1);
}

// Initialize Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

// Initialize Express server for webhooks
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

// Discord bot ready event
client.once('ready', async () => {
    console.log('✅ Discord bot is online!');
    console.log(`📱 Logged in as ${client.user.tag}`);

    // Register slash commands
    const commands = [
        {
            name: 'start',
            description: 'Check if the NFT mint tracker server is live'
        }
    ];

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

    try {
        console.log('🔄 Registering slash commands...');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
        console.log('✅ Slash commands registered successfully');
    } catch (error) {
        console.error('❌ Error registering slash commands:', error);
    }

    // Send test message to verify channel access
    try {
        const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
        const testEmbed = createTestEmbed();
        await channel.send({ embeds: [testEmbed] });
        console.log('✅ Successfully sent test message to Discord channel');
    } catch (error) {
        console.error('❌ Error accessing Discord channel:', error.message);
        console.error('Please verify your DISCORD_CHANNEL_ID is correct');
    }
});

// Discord error handling
client.on('error', error => {
    console.error('❌ Discord client error:', error);
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'start') {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const statusEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🟢 NFT Mint Tracker - Server Status')
            .setDescription('The bot is online and ready to track NFT mints!')
            .addFields(
                {
                    name: '📊 Status',
                    value: 'Running',
                    inline: true
                },
                {
                    name: '🔗 Discord',
                    value: client.isReady() ? '✅ Connected' : '❌ Disconnected',
                    inline: true
                },
                {
                    name: '🌐 Webhook Server',
                    value: `✅ Port ${PORT}`,
                    inline: true
                },
                {
                    name: '⏱️ Uptime',
                    value: `${hours}h ${minutes}m ${seconds}s`,
                    inline: true
                },
                {
                    name: '📡 Webhook Endpoint',
                    value: `http://localhost:${PORT}/webhook`,
                    inline: false
                }
            )
            .setTimestamp()
            .setFooter({ text: 'Powered by Helius' });

        await interaction.reply({ embeds: [statusEmbed] });
    }
});

// Webhook endpoint for Helius
app.post('/webhook', async (req, res) => {
    try {
        console.log('📨 Received webhook request');

        // Optional: Verify webhook secret
        if (WEBHOOK_SECRET) {
            const providedSecret = req.headers['x-webhook-secret'] || req.query.secret;
            if (providedSecret !== WEBHOOK_SECRET) {
                console.warn('⚠️ Invalid webhook secret');
                return res.status(401).json({ error: 'Unauthorized' });
            }
        }

        // Process the webhook data
        const webhookData = req.body;

        // Handle the mint event
        await handleMintEvent(webhookData, client, DISCORD_CHANNEL_ID);

        // Respond to Helius
        res.status(200).json({ success: true, message: 'Webhook processed' });
    } catch (error) {
        console.error('❌ Error processing webhook:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        discord: client.isReady() ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        name: 'NFT Mint Tracker Bot',
        status: 'running',
        endpoints: {
            webhook: '/webhook',
            health: '/health'
        }
    });
});

// Start Express server
const server = app.listen(PORT, () => {
    console.log(`🚀 Webhook server listening on port ${PORT}`);
    console.log(`📡 Webhook endpoint: http://localhost:${PORT}/webhook`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
});

// Login to Discord
client.login(process.env.DISCORD_BOT_TOKEN).catch(error => {
    console.error('❌ Failed to login to Discord:', error.message);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Express server closed');
        client.destroy();
        console.log('✅ Discord client disconnected');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Express server closed');
        client.destroy();
        console.log('✅ Discord client disconnected');
        process.exit(0);
    });
});
