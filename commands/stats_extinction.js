const { SlashCommandBuilder } = require('discord.js');
const { Interface } = require('readline');


async function get_extinction_data(user) {

 
    console.log("////////////////")
    console.log("/////////////////////")
    console.log("////////////////")

    url = "https://api.gtaliferp.fr:8443/v1/extinction/profiles/discord/" + user.id

    const response = await fetch(url, {
        "credentials": "omit",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
            "Alt-Used": "api.gtaliferp.fr:8443",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "If-None-Match": "W/\"91f-/zAcFce4XlbkMEztNPhLGROj5gI\""
        },
        "method": "GET",
        "mode": "cors"
    });
    const data = await response.json();


    
    let stats_value = {
    
        zombie : data["stats"][12]["value"],
        pvp_kill : data["stats"][9]["value"],
        death : data["stats"][11]["value"],
        ratio : data["stats"][29]["value"],
        zombie_redzone : data["stats"][9]["value"],
        kill_redzone : data["stats"][6]["value"],
        death_redzone : data["stats"][4]["value"],
        ratio_redzone : data["stats"][8]["value"],
        played_time : data["stats"][30]["value"]/3600,
        level : data["rank"]
}; // player stats 

    return stats_value;
}




module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats_extinction')
		.setDescription('Te files tes stats sur GLife Extinction.'),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		
        const stats = await get_extinction_data(interaction.user);
        
        await interaction.reply(`${interaction.user.username}, voici tes stats sur GLife Extinction.\n 

        
        ${stats.zombie} 🧟 Zombies tués \n
        ${stats.pvp_kill} ⚔️ Opps tués \n
        ${stats.death} 🩸 Morts \n
        ${stats.ratio} 〽 Ratio \n
        ${stats.zombie_redzone} 🧟🔴 Zombies tués en redzone \n
        ${stats.kill_redzone} ⚔️🔴 Opps tués en redzone \n
        ${stats.death_redzone} 🩸🔴 Morts en redzone \n
        ${stats.ratio_redzone} 〽🔴 Ratio en redzone \n
        ${stats.level} 👾 Niveau \n
        \n
    

        `);
	},
};