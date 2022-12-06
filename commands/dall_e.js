const { SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const { openai_token } = require('../config.json');
const { AttachmentBuilder } = require('discord.js');





const configuration = new Configuration({
    organization: "org-RsM7z7Dhw5w6viYnvLDGY1De",
    apiKey: openai_token,
});

const openai = new OpenAIApi(configuration);

let img_list = [];
async function ask_gpt(prompt) {
    
    console.log(prompt);
    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + openai_token
        },

        body: JSON.stringify({
            'prompt': prompt,
            'n': 1,
            'size': "512x512"
        })
    });
    const data = await response.json();
    console.log(data);


    const answer = {
        title: 'Reponse au prompt "' + prompt + '"\n',
        image: {
            url: data.data[0].url,
        },
    };
    
    let url = data.data[0].url;
    const file = new AttachmentBuilder(url);
    img_list[0] = file;

    return answer



}




module.exports = {
	data: new SlashCommandBuilder()
		.setName('dall_e')
		.setDescription("Fait ta demande d'image à l'IA la plus développée du monde.")
        .addStringOption(option =>
            option
            .setName('prompt')
            .setDescription("Ta demande à l'IA")
            .setRequired(true)),

	async execute(interaction) {

        
        
        interaction.deferReply(`${interaction.user.username} la réponse arrive sous peu...`)
        const prompt = interaction.options.getString("prompt");
        console.log("1______ " + prompt);
        const answer = await ask_gpt(prompt);
		interaction.editReply({ embeds: [answer] });
	},
};
