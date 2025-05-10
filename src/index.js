import 'dotenv/config'
import { Client, Events, IntentsBitField } from 'discord.js';

const TOKEN = process.env.BOT_TOKEN;

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
	]
});

client.on(Events.ClientReady, () => {
	console.log(`${client.user.tag} is now online.`)
})

client.login(TOKEN);