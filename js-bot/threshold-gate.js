/**
 * THE THRESHOLD — win-code + account-age gate
 * ────────────────────────────────────────────
 * Moves someone from Lobby (read-only, just joined via the win-unlocked
 * invite) up to "Person of Interest" (can post, can run /intake).
 *
 * Looks up roles/channels BY NAME (not ID) so nothing needs to be
 * copy-pasted from Discord settings. Names must match exactly
 * (case-sensitive) what's already in the server.
 */

'use strict';

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const LOBBY_ROLE_NAME = 'Lobby';
const POI_ROLE_NAME = 'Person of Interest';
const MOD_LOG_CHANNEL_NAME = 'claim-attempts-log';

const MIN_ACCOUNT_AGE_DAYS = 30;
const WIN_CODE = process.env.WIN_CODE; // set in Railway Variables tab
const MAX_ATTEMPTS_BEFORE_FLAG = 5;

const attempts = new Map();

const command = new SlashCommandBuilder()
  .setName('claim')
  .setDescription('Prove you cleared the prototype and step further in.')
  .addStringOption((opt) => opt.setName('code').setDescription('The code from your win screen').setRequired(true));

function accountAgeDays(user) {
  return Math.floor((Date.now() - user.createdTimestamp) / (1000 * 60 * 60 * 24));
}

function registerThreshold(client) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand() || interaction.commandName !== 'claim') return;

    const guild = interaction.guild;
    const lobbyRole = guild.roles.cache.find((r) => r.name === LOBBY_ROLE_NAME);
    const poiRole = guild.roles.cache.find((r) => r.name === POI_ROLE_NAME);
    const modLogChannel = guild.channels.cache.find((c) => c.name === MOD_LOG_CHANNEL_NAME);

    if (!lobbyRole || !poiRole) {
      console.error(`threshold-gate: missing role(s) — Lobby found: ${!!lobbyRole}, POI found: ${!!poiRole}`);
      return interaction.reply({ content: 'Something is misconfigured on this end — a mod has been notified.', ephemeral: true });
    }
    if (!WIN_CODE) {
      console.error('threshold-gate: WIN_CODE env var is not set');
      return interaction.reply({ content: 'Something is misconfigured on this end — a mod has been notified.', ephemeral: true });
    }

    const member = interaction.member;
    const submitted = interaction.options.getString('code').trim();

    if (!member.roles.cache.has(lobbyRole.id)) {
      return interaction.reply({ content: 'There’s nothing here for you to claim yet.', ephemeral: true });
    }
    if (member.roles.cache.has(poiRole.id)) {
      return interaction.reply({ content: 'You’re already through.', ephemeral: true });
    }

    const ageDays = accountAgeDays(interaction.user);
    const codeOk = submitted.toLowerCase() === WIN_CODE.toLowerCase();
    const ageOk = ageDays >= MIN_ACCOUNT_AGE_DAYS;

    if (codeOk && ageOk) {
      await member.roles.add(poiRole.id).catch(() => null);
      return interaction.reply({
        content: 'The code checks out. You’re through — the intake file is open to you now.',
        ephemeral: true,
      });
    }

    const count = (attempts.get(interaction.user.id) || 0) + 1;
    attempts.set(interaction.user.id, count);

    if (count >= MAX_ATTEMPTS_BEFORE_FLAG && modLogChannel) {
      const embed = new EmbedBuilder()
        .setTitle('Repeated failed /claim attempts')
        .setDescription(
          `<@${interaction.user.id}> (\`${interaction.user.id}\`) has failed ${count} times.\n` +
            `Account age: ${ageDays} days. Last code tried: \`${submitted}\``
        )
        .setColor(0xffa500)
        .setTimestamp();
      await modLogChannel.send({ embeds: [embed] });
    }

    return interaction.reply({
      content: 'That doesn’t match the record. Try again once you’re sure.',
      ephemeral: true,
    });
  });
}

module.exports = { registerThreshold, command };
