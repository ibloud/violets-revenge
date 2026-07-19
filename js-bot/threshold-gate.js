/**
 * THE THRESHOLD — win-code + account-age gate
 * ────────────────────────────────────────────
 * Moves someone from Lobby (read-only, just joined via the win-unlocked
 * invite) up to "Person of Interest" (can post, can run /intake).
 *
 * Two checks, both must pass:
 *   1. They know the code shown ONLY on the HTML game's win screen
 *      (not the loss screen, not mid-game — so a screenshot passed
 *      around before someone actually wins doesn't leak it).
 *   2. Their Discord account is old enough to not be a same-day
 *      throwaway made just to grab the invite.
 */

'use strict';

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// ── Config (TODO: replace placeholders) ──
const LOBBY_ROLE_ID = 'PUT_LOBBY_ROLE_ID_HERE';
const POI_ROLE_ID = 'PUT_PERSON_OF_INTEREST_ROLE_ID_HERE';
const MOD_LOG_CHANNEL_ID = 'PUT_MOD_LOG_CHANNEL_ID_HERE'; // flagged attempts get posted here

const MIN_ACCOUNT_AGE_DAYS = 30; // tune to taste
const WIN_CODE = 'PUT_THE_ACTUAL_WIN_SCREEN_CODE_HERE'; // must match what the HTML game shows on a win
const MAX_ATTEMPTS_BEFORE_FLAG = 5; // repeated wrong guesses get logged for mods, not auto-banned

const attempts = new Map(); // userId -> count (resets on bot restart; swap for persistent store if needed)

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

    const member = interaction.member;
    const submitted = interaction.options.getString('code').trim();

    // Must actually be in the Lobby to run this at all
    if (LOBBY_ROLE_ID && !member.roles.cache.has(LOBBY_ROLE_ID)) {
      return interaction.reply({ content: 'There’s nothing here for you to claim yet.', ephemeral: true });
    }

    // Already past this gate
    if (member.roles.cache.has(POI_ROLE_ID)) {
      return interaction.reply({ content: 'You’re already through.', ephemeral: true });
    }

    const ageDays = accountAgeDays(interaction.user);
    const codeOk = submitted.toLowerCase() === WIN_CODE.toLowerCase();
    const ageOk = ageDays >= MIN_ACCOUNT_AGE_DAYS;

    if (codeOk && ageOk) {
      await member.roles.add(POI_ROLE_ID).catch(() => null);
      return interaction.reply({
        content: 'The code checks out. You’re through — the intake file is open to you now.',
        ephemeral: true,
      });
    }

    // Failed for one reason or another — count attempts, don't reveal which check failed
    const count = (attempts.get(interaction.user.id) || 0) + 1;
    attempts.set(interaction.user.id, count);

    if (count >= MAX_ATTEMPTS_BEFORE_FLAG && MOD_LOG_CHANNEL_ID) {
      const logChannel = await interaction.client.channels.fetch(MOD_LOG_CHANNEL_ID).catch(() => null);
      if (logChannel) {
        const embed = new EmbedBuilder()
          .setTitle('Repeated failed /claim attempts')
          .setDescription(
            `<@${interaction.user.id}> (\`${interaction.user.id}\`) has failed ${count} times.\n` +
              `Account age: ${ageDays} days. Last code tried: \`${submitted}\``
          )
          .setColor(0xffa500)
          .setTimestamp();
        await logChannel.send({ embeds: [embed] });
      }
    }

    return interaction.reply({
      content: 'That doesn’t match the record. Try again once you’re sure.',
      ephemeral: true,
    });
  });
}

module.exports = { registerThreshold, command };
