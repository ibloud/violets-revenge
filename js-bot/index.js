/**
 * ENTRY POINT — Violet's Revenge JS bot
 * ───────────────────────────────────────
 * This is a SEPARATE Discord bot application from violet_bot.py.
 * Do not point this at the same DISCORD_TOKEN as the Python bot —
 * two processes sharing one bot token can both receive the same
 * gateway interaction events and double-respond. Create a new bot
 * application in the Discord Developer Portal, invite it to the
 * server (with "applications.commands" + "bot" scopes, and the
 * Manage Roles permissions it needs below), and use *that* token here.
 *
 * Env vars needed (Railway → this service's own Variables tab):
 *   JS_BOT_TOKEN        — the new bot application's token
 *   JS_BOT_CLIENT_ID    — that application's client ID (for command registration)
 *   GUILD_ID            — the Violet's Revenge server ID
 */

'use strict';

require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const { registerThreshold, command: claimCommand } = require('./threshold-gate.js');
const { registerIntake, command: intakeCommand } = require('./intake-modal.js');

const TOKEN = process.env.JS_BOT_TOKEN;
const CLIENT_ID = process.env.JS_BOT_CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error('Missing required env vars: JS_BOT_TOKEN, JS_BOT_CLIENT_ID, GUILD_ID');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  const body = [claimCommand.toJSON(), intakeCommand.toJSON()];

  // Guild-scoped registration — updates instantly, unlike global commands
  // which can take up to an hour to propagate. Fine for a single-server bot.
  await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body });
  console.log('Registered /claim and /intake for guild', GUILD_ID);
}

client.once('clientReady', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  await registerCommands();
});

registerThreshold(client);
registerIntake(client);

client.login(TOKEN);
