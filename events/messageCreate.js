const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { readdirSync } = require('fs');
const moment = require('moment');
const errorEmbed = require('../embeds');
const { data } = require('../data');
const db = require('../db');


module.exports = {
    name: 'messageCreate',

    async execute(message, client) {
        if (message.author.bot) return;

        try {
            db.get(`SELECT * FROM users WHERE id = ${message.author.id}`, async (err, row) => {
                if (err) throw err;
                if (!row) {
                    db.run(`INSERT INTO users (id, feur) VALUES (?, ?)`, [message.author.id, 0]);
                }
            })

            const guilds = client.guilds.cache.size;
            const users = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
            const urlInvite = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;

            const embed = new EmbedBuilder()
                .setColor(data.colors.base)

            const buttonInvite = new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel(`Ajouter le bot`)
                .setURL(urlInvite)


            if (message.content === `<@` + client.user.id + `>`) {
                embed.setAuthor({ name: `${client.user.tag}`, iconURL: client.user.avatarURL() })
                embed.setDescription(`Je suis présent sur **${guilds} Serveurs** et je regarde **${users} Utilisateurs**\nMon but est de compter les **FEUR** que je réponds sur le serveur.`)
                const row = new ActionRowBuilder()
                    .addComponents(buttonInvite)
                message.reply({ embeds: [embed], components: [row] });
            }

            // if message content is in data.quoi
            if (data.quoi.some(word => message.content.toLowerCase().includes(word))) {
                db.run(`UPDATE users SET feur = feur + 1 WHERE id = ${message.author.id}`);
                db.run(`UPDATE guilds SET feur = feur + 1 WHERE id = ${message.guild.id}`);
                db.run(`UPDATE bot SET feur = feur + 1 WHERE id = ${client.user.id}`);
                
                db.get(`SELECT * FROM guilds WHERE id = ${message.guild.id}`, async (err, row) => {
                    if (err) throw err;
                    const feurCount = row.feur;
                    message.reply({ content: `Feur #${feurCount}` });
                })
            }

        } catch (error) {
            console.log(error);
            errorEmbed.setDescription(`Merci de contacter le support\n\`\`\`${error}\`\`\``)
            message.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
}