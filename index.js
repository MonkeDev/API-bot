const { Client } = require('eris');
const config = require('./config.json');
const fs = require('fs');

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

bot.on('ready', () => { 
    console.log(bot.user.username + ' is ready!');
    bot.editStatus("idle", {
        name: `${bot.config.PREFIX}help`,
        type: 3
    });
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