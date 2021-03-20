const { Client } = require('eris');
const config = require('./config.json');
const fs = require('fs');
const fetch = require('node-fetch').default;
const pm = require('pretty-ms');

class apiBot extends Client {
    constructor(token, options) {
        super(token, options);

        this.baseLink = config.BASE_API_LINK;
        this.config = config;

        this.commands = new Map();
        this.alli = new Map();
    };

};

const bot = new apiBot(config.BOT_TOKEN, {});

bot.on('messageCreate', async msg => {
    if(msg.author.bot || !msg.channel.guild || !msg.content.startsWith(bot.config.PREFIX)) return;

    let args = msg.content.slice(bot.config.PREFIX.length).split(' ');
    const cmd = bot.commands.get(args[0].toLowerCase()) || bot.alli.get(args[0].toLowerCase());

    if(!cmd) return;

    if(!bot.config.ADMINS.includes(msg.author.id) && cmd.admin) return msg.channel.createMessage('You cant use this command bro.');

    cmd.run(msg, args.slice(1));
});

let message;
bot.on('ready', async () => { 
    console.log(bot.user.username + ' is ready!');
    bot.editStatus("idle", {
        name: `${bot.config.PREFIX}help`,
        type: 3
    });

    if(!message && !bot.config.messageID) {
        message = await bot.createMessage(bot.config.channelID, 'Hello World');
        bot.config.messageID = message.id;
        fs.writeFileSync(__dirname + '/config.json', JSON.stringify(bot.config));
    } else message = await bot.getMessage(bot.config.channelID, bot.config.messageID);

    setInterval(async () => {
        const before = Date.now();
        let res = await fetch('https://api.monkedev.com/info?key=' + bot.config.API_KEY);
        const ping = Date.now() - before;
        res = await res.json();
        message.edit({
            content: '',
            embed: {
                title: 'API Stats',
                description: `**Ping:** \`${pm(ping)}\`\
                \n**Alltime req (3/20/2021 ~ Now):** \`${res.req.allTime}\`\
                \n**Req (This process)**: \`${res.req.thisProcess.toLocaleString()}\`\
                \n**Avg req/m**: \`${(res.req.thisProcess / ((res.uptime / 1000) / 60)).toFixed(2).toLocaleUpperCase()}\``,
                color: 0xf7c38e,
                footer: {
                    text: 'Last Updated'
                },
                timestamp: new Date
            }
        });
    }, 60 * 1000);

});

const Init = async () => {
    const dirs = fs.readdirSync(__dirname + '/commands');
    dirs.forEach(dir => {
        const file = new (require(__dirname + '/commands/' + dir))(bot);
        bot.commands.set(file.name, file);
        file.alli.forEach(alli => {
            bot.alli.set(alli, file);
        });
    });

    bot.connect();
};

Init();