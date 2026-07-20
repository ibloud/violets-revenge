/**
 * INTAKE FILE — screening questionnaire
 * ──────────────────────────────────────
 * /intake opens a modal for POI users and sends answers to mod review.
 *
 * Looks up roles/channels BY NAME (not ID). Names must match exactly
 * (case-sensitive) what's already in the server.
 */

'use strict';

const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

const REVIEW_CHANNEL_NAME = 'the-intake-file';
const GRANTED_ROLE_NAME = 'Playtester';
const POI_ROLE_NAME = 'Person of Interest';

const QUESTIONS = [
  { id: 'business', label: 'State your business in the morgue.', style: TextInputStyle.Paragraph },
  { id: 'body', label: "A body isn't finished talking. What do you do?", style: TextInputStyle.Paragraph },
  { id: 'moment', label: 'Favorite (or least favorite) prototype moment?', style: TextInputStyle.Paragraph },
  { id: 'losing', label: 'Pennywise plays fair — until he doesn’t. Thoughts on losing?', style: TextInputStyle.Short },
  { id: 'note', label: 'Anything Violet should know? (optional)', style: TextInputStyle.Paragraph },
];

const command = new SlashCommandBuilder()
  .setName('intake')
  .setDescription('Submit your intake statement for review.');

function registerIntake(client) {
  client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand() && interaction.commandName === 'intake') {
      const guild = interaction.guild;
      const poiRole = guild.roles.cache.find((r) => r.name === POI_ROLE_NAME);

      if (!poiRole) {
        console.error(`intake-modal: missing role — POI found: ${!!poiRole}`);
        return interaction.reply({ content: 'Something is misconfigured on this end — a mod has been notified.', ephemeral: true });
      }
      if (!interaction.member.roles.cache.has(poiRole.id)) {
        return interaction.reply({
          content: 'The file is sealed until you’ve cleared the lobby.',
          ephemeral: true,
        });
      }

      const modal = new ModalBuilder().setCustomId('intakeModal').setTitle('CASE FILE — Intake Statement');
      const rows = QUESTIONS.map((q) =>
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId(q.id)
            .setLabel(q.label.slice(0, 45))
            .setStyle(q.style)
            .setRequired(q.id !== 'note')
            .setMaxLength(1000)
        )
      );
      modal.addComponents(...rows);
      return interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId === 'intakeModal') {
      const answers = QUESTIONS.map((q) => ({
        name: q.label,
        value: interaction.fields.getTextInputValue(q.id) || '_(skipped)_',
      }));

      const embed = new EmbedBuilder()
        .setTitle('New Intake Statement')
        .setDescription(`Applicant: <@${interaction.user.id}> (\`${interaction.user.id}\`)`)
        .addFields(answers)
        .setColor(0x8b0000)
        .setTimestamp();

      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`intake_approve_${interaction.user.id}`).setLabel('Approve').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`intake_reject_${interaction.user.id}`).setLabel('Reject').setStyle(ButtonStyle.Danger)
      );

      const reviewChannel = interaction.guild.channels.cache.find((c) => c.name === REVIEW_CHANNEL_NAME);
      if (!reviewChannel) {
        console.error(`intake-modal: missing channel — #${REVIEW_CHANNEL_NAME} not found`);
        return interaction.reply({ content: 'Something is misconfigured on this end — a mod has been notified.', ephemeral: true });
      }
      await reviewChannel.send({ embeds: [embed], components: [buttons] });

      return interaction.reply({
        content: 'Your statement has been filed. Someone will be in touch.',
        ephemeral: true,
      });
    }

    if (interaction.isButton() && interaction.customId.startsWith('intake_')) {
      const [, action, applicantId] = interaction.customId.split('_');
      const guild = interaction.guild;
      const grantedRole = guild.roles.cache.find((r) => r.name === GRANTED_ROLE_NAME);
      const applicant = await guild.members.fetch(applicantId).catch(() => null);

      if (action === 'approve' && applicant && grantedRole) {
        await applicant.roles.add(grantedRole.id).catch(() => null);
        await applicant.send('Your statement checked out. Welcome in.').catch(() => null);
      } else if (applicant) {
        await applicant.send('Your statement didn’t clear review this time.').catch(() => null);
      }

      const updated = EmbedBuilder.from(interaction.message.embeds[0]).setFooter({
        text: `${action === 'approve' ? 'Approved' : 'Rejected'} by ${interaction.user.tag}`,
      });
      await interaction.update({ embeds: [updated], components: [] });
    }
  });
}

module.exports = { registerIntake, command };
