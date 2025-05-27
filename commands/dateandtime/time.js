const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('time')
		.setDescription('Date and time in England'),
	async execute(interaction) {
        const now = new Date();
		const options = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
			timeZone: 'Europe/London',
		};
        const londonTime = now.toLocaleString('en-GB', options);
        return interaction.reply(`Current date and time in London: ${londonTime}`);
	},
};
