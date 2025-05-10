import 'dotenv/config'
import { Client, IntentsBitField } from 'discord.js';

const TOKEN = process.env.BOT_TOKEN;

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
	]
});

client.login(TOKEN);