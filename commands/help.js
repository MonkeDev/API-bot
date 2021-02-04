module.exports = class {
    constructor(bot) {
        this.bot = bot;

        this.name = 'help';
        this.alli = [];

        this.desc = 'You need help ?'
    }

    async run(msg, args) {
        let BRUH = '';
        this.bot.commands.forEach(c => {
            BRUH += `\`${this.bot.config.PREFIX}${c.name}\` - ${c.desc || 'No description'}\n`
        });
        msg.channel.createMessage(BRUH);
    }
}