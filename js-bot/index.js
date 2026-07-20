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
 *   WIN_CODE            — the code shown on the HTML game's win screen
 */

'use strict';

require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const { registerThreshold, command: claimCommand } = require('./threshold-gate.js');
const { registerIntake, command: intakeCommand } = require('./intake-modal.js');

const TOKEN = process.env.JS_BOT_TOKEN;
const CLIENT_ID = process.env.JS_BOT_CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const LOBBY_ROLE_NAME = 'Lobby';
const LOBBY_CHANNEL_NAME = 'the-lobby';
const RULES_CHANNEL_NAME = 'server-rules';
const HOW_TO_PLAY_CHANNEL_NAME = 'how-to-play';
const CONTENT_WARNING_CHANNEL_NAME = 'content-warning';

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error('Missing required env vars: JS_BOT_TOKEN, JS_BOT_CLIENT_ID, GUILD_ID');
  process.exit(1);
}
if (!process.env.WIN_CODE) {
  console.error('Missing required env var: WIN_CODE');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  const body = [claimCommand.toJSON(), intakeCommand.toJSON()];
  await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body });
  console.log('Registered /claim and /intake for guild', GUILD_ID);
}

// New member joins via the win-invite link → auto-assigned Lobby role.
// Without this, they land with no role at all and /claim rejects them
// immediately since it checks for Lobby first.
client.on('guildMemberAdd', async (member) => {
  const lobbyRole = member.guild.roles.cache.find((r) => r.name === LOBBY_ROLE_NAME);
  if (!lobbyRole) {
    console.error(`guildMemberAdd: role "${LOBBY_ROLE_NAME}" not found — cannot assign to ${member.user.tag}`);
    return;
  }
  await member.roles.add(lobbyRole.id).catch((err) => {
    console.error(`guildMemberAdd: failed to assign Lobby role to ${member.user.tag}:`, err);
  });

  const lobbyChannel = member.guild.channels.cache.find((c) => c.name === LOBBY_CHANNEL_NAME);
  const rulesChannel = member.guild.channels.cache.find((c) => c.name === RULES_CHANNEL_NAME);
  const howToChannel = member.guild.channels.cache.find((c) => c.name === HOW_TO_PLAY_CHANNEL_NAME);
  const contentWarningChannel = member.guild.channels.cache.find((c) => c.name === CONTENT_WARNING_CHANNEL_NAME);

  if (lobbyChannel) {
    const rulesLine = rulesChannel ? `<#${rulesChannel.id}>` : '#server-rules';
    const howToLine = howToChannel ? `<#${howToChannel.id}>` : '#how-to-play';
    const cwLine = contentWarningChannel ? `<#${contentWarningChannel.id}>` : '#content-warning';
    await lobbyChannel.send(
      `Welcome, <@${member.id}>. You're in the lobby for now — read ${cwLine}, ${rulesLine}, and ${howToLine} ` +
      `to get oriented, then head over and get playing.`
    ).catch(() => {});
  }
});

client.once('clientReady', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  await registerCommands();
});

registerThreshold(client);
registerIntake(client);

client.login(TOKEN);
