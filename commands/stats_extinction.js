const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js')
const puppeteer = require('puppeteer');
const { fs } = require('fs')

let stats = {}
async function get_template(path, player, player_avatar) {


    const data = await get_extinction_data(player);
    
    
    stats = {
    
        zombie : data["stats"][12]["value"],
        pvp_kill : data["stats"][9]["value"],
        death : data["stats"][11]["value"],
        ratio : data["stats"][29]["value"],
        zombie_redzone : data["stats"][6]["value"],
        kill_redzone : data["stats"][4]["value"],
        death_redzone : data["stats"][8]["value"],
        ratio_redzone : data["stats"][30]["value"],
        played_time : parseInt(data["stats"][1]["value"]/3600),
        level : data["rank"],
        player_name : data["name"],
        bank : data["bank"]

    }; // player stats 

    
    const browser = await puppeteer.launch({ 
        ignoreDefaultArgs: '--disable-extensions, --force-device-scale-factor',
        headless:true
    }); 
    const page = await browser.newPage();
    await page.setViewport({
        width: 760,
        height: 1170,
        deviceScaleFactor: 4,   
    });          
    let html = '<html lang="en style="background: #333"><head><title>Stats Extinction</title><meta charset="UTF-8" /><style></style></head><body style="font-family: Tahoma, Geneva, Verdana, sans-serif;margin:0;padding: 20px;background: #333;width: 720px ;height: 580px;"><div id="wrapper" style="text-align:center;width:720px;height:1130px;border-radius: 20px;background: linear-gradient(0deg, rgb(3, 3, 205) 5%, rgb(47, 0, 255) 15%, blueviolet 50%, rgb(62, 19, 102) 100%);box-shadow: 0px 0px 40px 8px blueviolet;display: flex;flex-flow: column;align-items: center;justify-content: space-between;font-family: Tahoma;text-align: center;"><img src='+ player_avatar +' style="width: 360px;height: 360px;border-radius: 50%;margin: 16px;flex-shrink: 0;"/><div id="player_name" style="color: white;font-size: 24px;margin-bottom: 8px;">'+stats.player_name+'</div><div id="player_stats" style="width: 720px;height: 720px;color: white;display: flex;flex-flow: column wrap;"><div id="level" style="display: flex;flex-direction: column;width:360px;line-height: 2;font-size: 24px;height:140px;background-color: rgba(0,0,0,0.75);">👾Niveau👾<div id="level" style="text-align:center;font-size: 44px;width:360px;height:140px;">'+stats.level+'</div></div><div id="zombie" style="display: flex;flex-direction: column;width:360px;line-height: 2;font-size: 24px;height:140px;background-color: rgba(0,0,0,0.75);align-items: center;">🧟Zombies tués🧟<div id="zombie" style="font-size: 44px;width:360px;height:140px;">'+ stats.zombie +'</div></div><div id="pvp_kill" style="display: flex;flex-direction: column;width:360px;line-height: 2;font-size: 24px;height:140px;background-color: rgba(0,0,0,0.75);">⚔️Opps tués⚔️<div id="pvp_kill" style="text-align:center;font-size: 44px;width:360px;height:140px;">'+ stats.pvp_kill +'</div></div><div id="death" style="display: flex;flex-direction: column;width:360px;line-height: 2;font-size: 24px;height:140px;background-color: rgba(0,0,0,0.75);">🩸Morts🩸<div id="death" style="text-align:center;font-size: 44px;width:360px;height:140px;">'+stats.death +'</div></div><div id="ratio" style="display: flex;flex-direction: column;width:360px;line-height: 2;font-size: 24px;height:140px;border-radius: 0 0 0 20px;background-color: rgba(0,0,0,0.75);">〽Ratio〽<div id="ratio" style="text-align:center;font-size: 44px;width:360px;height:140px;">'+stats.ratio+'</div></div><div id="played_time" style="display: flex;flex-direction: column;width:360px;line-height: 2;font-size: 24px;height:140px;background-color: rgba(0,0,0,0.75);">🕒Heures de jeu🕒<div id="played_time" style="text-align:center;font-size: 44px;width:360px;height:140px;">'+stats.played_time+'</div></div><div id="zombie_redzone" style="display: flex;flex-direction: column;width:360px;line-height: 2;font-size: 24px;height:140px;background-color: rgba(0,0,0,0.75);">🧟Zombies tués Redzone🔴<div id="zombie_redzone" style="text-align:center;font-size: 44px;width:360px;height:140px;">'+stats.zombie_redzone+'</div></div><div id="kill_redzone" style="display: flex;flex-direction: column;width:360px;line-height: 2;font-size: 24px;height:140px;background-color: rgba(0,0,0,0.75);">⚔️Opps tués Redzone🔴<div id="kill_redzone" style="text-align:center;font-size: 44px;width:360px;height:140px;">'+stats.kill_redzone+'</div></div><div id="death_redzone" style="display: flex;flex-direction: column;width:360px;line-height: 2;font-size: 24px;height:140px;background-color: rgba(0,0,0,0.75);">🩸Morts Redzone🔴<div id="death_redzone" style="text-align:center;font-size: 44px;width:360px;height:140px;">'+stats.death_redzone+'</div></div><div id="ratio_deadzone" style="display: flex;flex-direction: column;width:360px;line-height: 2;font-size: 24px;height:140px;background-color: rgba(0,0,0,0.75);border-radius: 0 0 20px 0;">〽Ratio Redzone🔴<div id="ratio_deadzone" style="text-align:center;font-size: 44px;width:360px;height:140px;">'+stats.ratio_redzone+'</div></div></div></div></body>';  
    await page.setContent(html)


    
    await page.screenshot({path: path, type:"jpeg"});

    await page.close();
    await browser.close();

    
}

async function get_extinction_data(user) {

 
    console.log("////////////////")
    console.log("/////////////////////")
    console.log("////////////////")

    url = "https://api.gtaliferp.fr:8443/v1/extinction/profiles/discord/" + user

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



    return data;
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats_extinction')
		.setDescription('Te files tes stats sur GLife Extinction.'),
        //.addUserOption(option =>
		//	option
		//		.setName('joueur')
		//		.setDescription("Joueur à analyser. Si rien n'est précisé, analyse ton profil.")
		//		.setRequired(false)),
	async execute(interaction) {

        
        let player = interaction.user.id;

        
//
        //await interaction.deferReply(`${interaction.user.username}, voici les stats GLife Extinction demandées.//\n 
   //
//
//
        //${stats.player_name}\n
        //
        //${stats.zombie} 🧟 Zombies tués \n
        //${stats.pvp_kill} ⚔️ Opps tués \n
        //${stats.death} 🩸 Morts \n
        //${stats.ratio} 〽 Ratio \n
        //${stats.zombie_redzone} 🧟🔴 Zombies tués en redzone \n
        //${stats.kill_redzone} ⚔️🔴 Opps tués en redzone \n
        //${stats.death_redzone} 🩸🔴 Morts en redzone \n
        //${stats.ratio_redzone} 〽🔴 Ratio en redzone \n
        //${parseInt(stats.played_time)} 🕒 Heures de jeu \n
        //${stats.level} 👾 Niveau \n
        //\n
        // 
        //\n
        // 
//
        //`);

        interaction.deferReply("Incoming...");
        let rand = Math.floor(Math.random() * 1000);
        let path = "../stats_img" + player + "_" + rand + ".jpg"; 

        console.log(path)
        let player_avatar = "https://cdn.discordapp.com/avatars/" + player + "/" + interaction.user.avatar + ".png"
        console.log(player_avatar)
        await get_template(path, player, player_avatar);
        
        const file = new AttachmentBuilder(path, {name: player + "_" +rand + ".jpg"});
        const embed = new EmbedBuilder()
            .setTitle("Statistiques Extinction : \nBank : " + stats.bank + "$")
            .setImage("attachment://" + path)
    

        interaction.editReply({ embeds: [embed], files: [path]});

        console.log("%cAll goood !", "color: green")
	}
};
