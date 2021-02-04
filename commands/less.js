const fetch = require('node-fetch').default;
module.exports = class {
    constructor(bot) {
        this.bot = bot;

        this.name = 'less';
        this.alli = [];

        this.admin = true;

        this.desc = 'Want less rate-limit, Use this.'
    }

    async run(msg, args) {

        const user = msg.mentions[0] || msg.channel.guild.members.get(args[1]) || msg.author;

        const amount = parseInt('-' + args[0]);
        if(!amount) return msg.channel.createMessage('How much?');

        const res = await (await fetch(this.bot.baseLink + '/add?userID=' + user.id + '&key=' + this.bot.config.API_KEY + '&amount=' + amount, {
            method: 'POST',
            headers: { auth: this.bot.config.API_ADMIN }
        })).json();

        if(res.error) return msg.channel.createMessage(res.message);

        msg.channel.createMessage(`${user.username}#${user.discriminator}'s max rate-limit is now ${res.ratelimit.max}`);
        
    }
}