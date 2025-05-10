import 'dotenv/config';
import { SlashCommandBuilder } from "discord.js";
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

export const data = new SlashCommandBuilder()
	.setName('gemini')
	.setDescription('Ask Gemini and get response in text')
	.addStringOption(option =>
		option.setName('text')
			.setDescription('Message for Gemini')
			.setRequired(true)
	);

export async function execute(interaction) {
	const ai = new GoogleGenAI({ apiKey: API_KEY });

	const input = interaction.options.getString('text');
	await interaction.reply({ content: '🧠 Thinking...', ephemeral: false});

	let aiResponse;

	try {
		const response = await await ai.models.generateContent({
			model: "gemini-2.0-flash",
			contents: input,
		})
		aiResponse = response.text;
	} catch (e) {
		console.log(e);
		return interaction.editReply('❌ Failed to get response from OpenAI.');
	}

	interaction.editReply({ content: aiResponse, ephemeral: false});
}