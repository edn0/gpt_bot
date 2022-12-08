const { SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const { openai_token } = require('../config.json');

const configuration = new Configuration({
    organization: "org-RsM7z7Dhw5w6viYnvLDGY1De",
    apiKey: openai_token,
});

const openai = new OpenAIApi(configuration);

async function ask_gpt(prompt) {
    
    console.log(prompt);
    const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + openai_token
        },

        body: JSON.stringify({
            'model': 'text-davinci-003',
            'prompt': prompt,
            'temperature': 0,
            'max_tokens': 256
        })
    });
    const data = await response.json();
    console.log(data)
    console.log(data.choices[0].text);
    let answer = data.choices[0].text;
    return answer;

}




module.exports = {
	data: new SlashCommandBuilder()
		.setName('top10')
		.setDescription("Fait ta demande de top 10 à l'IA la plus développée du monde.")
        .addStringOption(option =>
            option
            .setName('sujet')
            .setDescription("Le sujet de ce top")
            .setRequired(true)),

	async execute(interaction) {

        interaction.deferReply(`${interaction.user.username} la réponse arrive sous peu...`)
        const prompt = interaction.options.getString("sujet");
        let prompt_to_send = "Top 10 " + prompt;
        console.log("2______ " + prompt);
        const answer = await ask_gpt(prompt_to_send);
		interaction.editReply(`"${prompt_to_send}" selon GPT-3.\n
        ${answer}`);
	},
};
