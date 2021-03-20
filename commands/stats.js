const fetch = require('node-fetch').default;
module.exports = class {
    constructor(bot) {
        this.bot = bot;

        this.name = 'stats';
        this.alli = [];

        this.desc = 'See stats on a user!'
    }

    async run(msg, args) {

        const user = msg.mentions[0] || msg.channel.guild.members.get(args[0]) || msg.author;

        const res = await (await fetch(this.bot.baseLink + '/user/info?userID=' + user.id + '&key=' + this.bot.config.API_KEY, {
            method: 'GET',
            headers: { auth: this.bot.config.API_ADMIN }
        })).json();

        if(!res) return msg.channel.createMessage(`${user.username}#${user.discriminator} is not registered.`);
        if(res.error) return msg.channel.createMessage(res.message);

        const toSend = {
            content: `${user.username}#${user.discriminator}'s stats`,
            embed: {
                fields: [],
                color: 0xFFA500
            }
        };

        toSend.embed.fields.push({name: 'Request', value: `Total: ${res.stats.total}`, inline: true});
        toSend.embed.fields.push({name: 'Rate-limit', value: `Max: ${res.ratelimit.max}\nUsed: ${res.ratelimit.used}`, inline: true});
        if(msg.content.endsWith('--admin') && this.bot.config.ADMINS.includes(msg.author.id)) toSend.embed.fields.push({name: 'Key', value: res.key, inline: true});
        msg.channel.createMessage(toSend);
    }
}