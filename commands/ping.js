module.exports = class {
    constructor(bot) {
        this.bot = bot;

        this.name = 'ping';
        this.alli = [];

        this.desc = 'pong'
    }

    async run(msg, args) {
        const message = await msg.channel.createMessage('Pinging...');

        message.edit(`Shard: ${msg.channel.guild.shard.latency}ms\nEdit-time: ${Date.now() - message.createdAt}ms`);

    }
}