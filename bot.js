"use strict";

const { Client, GatewayIntentBits } = require("discord.js");
const token                         = require("./discord-token.json");
const client                        = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.login(token.BOT_TOKEN);
