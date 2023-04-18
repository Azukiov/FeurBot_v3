const { ActivityType } = require('discord.js');
const { readdirSync } = require('fs');
const db = require('../db');

module.exports = {
    name: 'ready',

    async execute(client) {
        // check if the bot is on table bot
        db.get(`SELECT * FROM bot WHERE id = '${client.user.id}'`, (err, row) => {
            if (err) throw err;
            if (!row) {
                db.run(`INSERT INTO bot (id, feur) VALUES (?, ?)`, [client.user.id, 0]);
            }
        })
        
        
        client.guilds.cache.forEach(async guild => {
            db.get(`SELECT * FROM guilds WHERE id = '${guild.id}'`, (err, row) => {
                if (err) throw err;
                if (!row) {
                    db.run(`INSERT INTO guilds (id, feur) VALUES (?, ?)`, [guild.id, 0]);
                }
            })
        })

        const commands = readdirSync('./commands').length;
        const events = readdirSync('./events').length;
        const guilds = client.guilds.cache.size;
        const users = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);

        setInterval(() => {
            client.user.setActivity(`${users} Users`, { type: ActivityType.Watching})
        }, 10000);

        console.log(`Logged in as ${client.user.tag}!`);
        console.log(`Started at ${new Date().toLocaleString()}`)
        console.log(`Latency is ${Date.now() - client.readyAt}ms`)
        console.log(`Loaded ${commands} commands.`)
        console.log(`Loaded ${events} events.`)
        console.log(`Started in ${guilds} guilds.`)
        console.log(`Serving ${users} users.`)
    }
}