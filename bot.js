"use strict";

// SQLite3 導入
const sqlite3 = require("sqlite3");
const db      = new sqlite3.Database("235data.db");

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
