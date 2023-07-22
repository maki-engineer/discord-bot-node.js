import Discord from 'discord.js';

const token = require('../discord-token.json');
const prefix: string = '!';
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildBans,
        Discord.GatewayIntentBits.GuildEmojisAndStickers,
        Discord.GatewayIntentBits.GuildIntegrations,
        Discord.GatewayIntentBits.GuildWebhooks,
        Discord.GatewayIntentBits.GuildInvites,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildMessageTyping,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.DirectMessageReactions,
        Discord.GatewayIntentBits.DirectMessageTyping,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildScheduledEvents
    ]
});


client.on('ready', () => console.log('235bot is ready.'));


client.on('messageCreate', message => {
    if (message.author.bot) return;

    const messageText: string = message.content;
    if (!messageText.startsWith(prefix)) return;

    const command: string = messageText.slice(prefix.length);
    switch (command) {
        case 'ping':
            message.reply('pong!');
            break;
        case 'hello':
            message.reply('Hello there!');
            break;
    }
});


client.login(token.BOT_TOKEN);
