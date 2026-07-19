/**
 * INTAKE FILE — screening questionnaire
 * ──────────────────────────────────────
 * /intake opens a modal for POI users and sends answers to mod review.
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

// ── Config — TODO: replace placeholders ──
const REVIEW_CHANNEL_ID = 'PUT_MOD_REVIEW_CHANNEL_ID_HERE';
const GRANTED_ROLE_ID = 'PUT_TALKER_OR_PLAYTESTER_ROLE_ID_HERE';
const POI_ROLE_ID = 'PUT_PERSON_OF_INTEREST_ROLE_ID_HERE'; // who's allowed to run /intake

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
    // 1) /intake → open the modal
    if (interaction.isChatInputCommand() && interaction.commandName === 'intake') {
      if (POI_ROLE_ID && !interaction.member.roles.cache.has(POI_ROLE_ID)) {
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

    // 2) Modal submitted → post embed to mod review channel
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

      const reviewChannel = await interaction.client.channels.fetch(REVIEW_CHANNEL_ID);
      await reviewChannel.send({ embeds: [embed], components: [buttons] });

      return interaction.reply({
        content: 'Your statement has been filed. Someone will be in touch.',
        ephemeral: true,
      });
    }

    // 3) Mod clicks Approve/Reject
    if (interaction.isButton() && interaction.customId.startsWith('intake_')) {
      const [, action, applicantId] = interaction.customId.split('_');
      const guild = interaction.guild;
      const applicant = await guild.members.fetch(applicantId).catch(() => null);

      if (action === 'approve' && applicant) {
        await applicant.roles.add(GRANTED_ROLE_ID).catch(() => null);
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
