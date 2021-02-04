const fetch = require('node-fetch').default;
module.exports = class {
    constructor(bot) {
        this.bot = bot;

        this.name = 'register';
        this.alli = [];

        this.desc = 'Make a account and get your API key!'
    }

    async run(msg, args) {
        const res = await (await fetch(this.bot.baseLink + '/register?userID=' + msg.author.id + '&key=' + this.bot.config.API_KEY, {
            method: 'POST',
            headers: { auth: this.bot.config.API_ADMIN }
        })).json();

        if(res.error) return msg.channel.createMessage(res.message);

        const message = await msg.channel.createMessage('You are now registered, I will DM you your info!');
        this.bot.getDMChannel(msg.author.id).then(c => {
            c.createMessage(`Your API key: \`${res.key}\``).catch(() => {
                message.edit('Please enable your DMs so I can dm you your info!');
            });
        });
    }
}