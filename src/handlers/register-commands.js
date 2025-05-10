import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { dirname, resolve, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs';

const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const COMMANDS_GLOBAL = process.env.COMMANDS_GLOBAL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commands = [];

const commandsFolder = resolve(__dirname, '../commands');
const commandFiles = fs.readdirSync(commandsFolder);

for (const commandFile of commandFiles) {
    console.log(`Found command file: ${commandFile}!`);

    const commandPath = join(commandsFolder, commandFile)
    const commandPathURL = pathToFileURL(commandPath);
    try {
        const command = await import(commandPathURL);
        const mod = command.default ?? command;
        if ('data' in mod && 'execute' in mod) {
            commands.push(mod.data.toJSON());
        } else {
            console.log(`[WARNING] The command ${commandFile} at ${commandPath} is missing data or execute.`);
        }
    } catch (e) {
        console.error(e)
    }
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        if (COMMANDS_GLOBAL === 'true') {
            console.log('Reloading globaly');
            await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        } else {
            console.log('Reloading not globaly');
            await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands },);
        }

        console.log(`Successfully reloaded application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();