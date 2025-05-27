const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('monday')
		.setDescription('Is it Monday yet?'),
	async execute(interaction) {
        if (today.getDay() !== 1) {
            const daysUntilMonday = (8 - today.getDay()) % 7;
            return interaction.reply(`Nope. ${daysUntilMonday} day(s) until Monday.`);
        } else {
            return interaction.reply('Monday!');
        }
	},
};
