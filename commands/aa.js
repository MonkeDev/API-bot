const fetch = require('node-fetch').default;
module.exports = class {
    constructor(bot) {
        this.bot = bot;

        this.name = 'aa';
        this.alli = [];
        this.admin = true;
        this.desc = 'Add a attachment to the DB.'
    }

    async run(msg, args) {
        const FOR = args[0];
        const url = args[1];

        const res = await (await fetch(this.bot.baseLink + '/add/attachment?key=' + this.bot.config.API_KEY + '&url=' + url + '&FOR=' + FOR, {
            method: 'POST',
            headers: { auth: this.bot.config.API_ADMIN }
        })).json();

        msg.channel.createMessage(res.message);
    }
}