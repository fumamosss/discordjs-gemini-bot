import 'dotenv/config'
import { Client, Collection, Events, IntentsBitField, MessageFlags } from 'discord.js';
import { dirname, resolve, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs';

const TOKEN = process.env.BOT_TOKEN;

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
	]
});

client.commands = new Collection();

loadCommands();

client.on(Events.ClientReady, () => {
	console.log(`${client.user.tag} is now online.`)
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand) return;

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
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true});
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true});
		}
	}
})

client.login(TOKEN);

async function loadCommands() {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
	const commandsFolder = resolve(__dirname, './commands');
	const commandFiles = fs.readdirSync(commandsFolder);

	for (const commandFile of commandFiles) {
		console.log(`Found command file: ${commandFile}!`);

		const commandPath = join(commandsFolder, commandFile)
		const commandPathURL = pathToFileURL(commandPath);
		const command = await import(commandPathURL);
		const mod = command.default ?? command;
		if ('data' in mod && 'execute' in mod) {
			client.commands.set(mod.data.name, mod);
		} else {
			console.log(`[WARNING] The command ${commandFile} at ${commandPath} is missing data or execute property.`);
		}
	}
}