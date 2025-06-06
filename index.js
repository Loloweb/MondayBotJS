const {Client, Collection, Events, GatewayIntentBits, PresenceUpdateStatus, ActivityType } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const cron = require('node-cron');
const fs = require('node:fs');
const path = require('node:path');

//const CHANNEL_ID = '729426983699742791'; // update-avenue
const CHANNEL_ID = '553609326757937162'; // bot-boulevard

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ],
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

starttime = new Date();

client.on(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}!`);
    console.log('Time is ' + starttime.toLocaleTimeString());
	if (starttime.getDay() === 1) {
		readyClient.user.setActivity('a Monday!', { type: ActivityType.Watching });
	} else {
		readyClient.user.setActivity('for Mondays...', { type: ActivityType.Watching });
	}
    // Schedule task: At 00:00 every Monday
    cron.schedule('0 0 * * 1', async () => {

        const channel = await client.channels.fetch(CHANNEL_ID);
        if (channel) {
            channel.send('Monday!');
			console.log("Monday!");
			readyClient.user.setActivity('a Monday!', { type: ActivityType.Watching });
        }
    }, {
        timezone: "Europe/London" // lol
    });
	cron.schedule('0 0 * * 2', async () => {
		readyClient.user.setActivity('for Mondays...', { type: ActivityType.Watching });
	}, {
		timezone: "Europe/London"
	});
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});

client.login(token);