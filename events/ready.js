const { readdirSync } = require('fs');

module.exports = {
    name: 'ready',

    async execute(client) {
        const commands = readdirSync('./commands').length;
        const events = readdirSync('./events').length;
        const guilds = client.guilds.cache.size;
        const users = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);


        console.log(`Logged in as ${client.user.tag}!`);
        console.log(`Started at ${new Date().toLocaleString()}`)
        console.log(`Latency is ${Date.now() - client.readyAt}ms`)
        console.log(`Loaded ${commands} commands.`)
        console.log(`Loaded ${events} events.`)
        console.log(`Started in ${guilds} guilds.`)
        console.log(`Serving ${users} users.`)
    }
}