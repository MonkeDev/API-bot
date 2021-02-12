const fetch = require('node-fetch').default;
module.exports = class {
    constructor(bot) {
        this.bot = bot;

        this.name = 'top';
        this.alli = [];

        this.desc = 'See the top users!';

        this.restCache = new Map();
    }

    async run(msg, args) {


        let allUsers = await (await fetch(this.bot.baseLink + '/users?key=' + this.bot.config.API_KEY, {
            method: 'GET',
            headers: { auth: this.bot.config.API_ADMIN }
        })).json();


        allUsers = allUsers.filter(x => x);
        allUsers = allUsers.sort((a, b) => b.stats.total-a.stats.total);
        allUsers = allUsers.slice(0, 25);
        let desc = '';
        let countr = 1;
        await allUsers.forEach(async user => {
            if(user.stats.total == 0) return;
            desc += `${countr}. <@!${user.id}>, ${user.stats.total}\n`;
            countr++
        });


        desc = desc.slice(0, 2000);

        msg.channel.createMessage({embed: {
            title: 'Top users',
            description: desc,
            color: 0xf7c38e
        }});
    }
}