const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Juste ça répond pong, pour le test'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
