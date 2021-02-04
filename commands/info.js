const fetch = require('node-fetch').default;
module.exports = class {
    constructor(bot) {
        this.bot = bot;

        this.name = 'info';
        this.alli = [];

        this.desc = 'Get yout API key if you already have an account'
    }

    async run(msg, args) {
        const res = await (await fetch(this.bot.baseLink + '/user/info?userID=' + msg.author.id + '&key=' + this.bot.config.API_KEY, {
            method: 'GET',
            headers: { auth: this.bot.config.API_ADMIN }
        })).json();

        if(!res) return msg.channel.createMessage(`You are not registered, \`${this.bot.config.PREFIX}register\` to register.`);
        if(res.error) return msg.channel.createMessage(res.message);

        const message = await msg.channel.createMessage('I will DM you your info!');
        this.bot.getDMChannel(msg.author.id).then(c => {
            c.createMessage(`Your API key: \`${res.key}\``).catch(() => {
                message.edit('Please enable your DMs so I can dm you your info!');
            });
        });
    }
}