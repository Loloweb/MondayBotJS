const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('checkperms')
		.setDescription('Check if the bot can post in the set channel')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to check permissions for')
                .setRequired(true)),
	async execute(interaction) {
        // limit usage to me
        if (interaction.user.id !== '124188074031841282') { // replace with your user ID
            return interaction.reply({ content: "You're not the boss of me!", flags: MessageFlags.Ephemeral });
        } else {
            try {
                const channel = await interaction.client.channels.fetch(interaction.options.getChannel('channel').id);
                if (channel) {
                    const sentMessage = await channel.send('you saw nothing');
                    setTimeout(() => {
                            sentMessage.delete().catch(() => {});
                        }, 100);
                    if (sentMessage) {
                        await interaction.reply({ content: "yep", flags: MessageFlags.Ephemeral });
                    }
                } else {
                    await interaction.reply({ content: "Channel not found.", flags: MessageFlags.Ephemeral });
                }
            } catch (error) {
                await interaction.reply({ content: `Failed to send message: ${error.message}`, flags: MessageFlags.Ephemeral });
            }
        }
	}
};
