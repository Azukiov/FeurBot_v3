const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const db = require('../db');
const { data } = require('../data');
const date = require('../package.json')
const errorEmbed = require('../embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Affiche différentes statistiques')
        .addSubcommand(subcommand => subcommand.setName('guild').setDescription('Affiche les statistiques du serveur'))
        .addSubcommand(subcommand => subcommand.setName('user').setDescription('Affiche les statistiques de l\'utilisateur')
            .addUserOption(option => option.setName('utilisateur').setDescription('L\'utilisateur dont vous voulez voir les statistiques')))
        .addSubcommand(subcommand => subcommand.setName('bot').setDescription('Affiche les statistiques du bot')),


    run: async (client, interaction) => {
        try {
            const embed = new EmbedBuilder()
                .setColor(data.colors.base)

            const subcommand = interaction.options.getSubcommand();
            const user = interaction.options.getUser('utilisateur');

            if (subcommand === 'guild') {
                const guild = interaction.guild;
                db.get(`SELECT * FROM guilds WHERE id = ${guild.id}`, async (err, row) => {
                    if (err) throw err;
                    const feurCount = row.feur;
                    embed.setDescription(`J'ai répondu **${feurCount} feur** sur **${guild.name}**`)
                    interaction.reply({ embeds: [embed] });
                })
            }

            if (subcommand === 'user') {
                if (!user) {
                    db.get(`SELECT * FROM users WHERE id = ${interaction.user.id}`, async (err, row) => {
                        if (err) throw err;
                        const feurCount = row.feur;
                        embed.setDescription(`J'ai répondu **${feurCount} feur** à **${interaction.user.tag}**`)
                        interaction.reply({ embeds: [embed] });
                    })
                } else {
                    db.get(`SELECT * FROM users WHERE id = ${user.id}`, async (err, row) => {
                        if (err) throw err;
                        const feurCount = row.feur;
                        embed.setDescription(`J'ai répondu **${feurCount} feur** à **${user.tag}**`)
                        interaction.reply({ embeds: [embed] });
                    })
                }
            } 

            if (subcommand === 'bot') {
                db.get(`SELECT * FROM bot WHERE id = ${client.user.id}`, async (err, row) => {
                    if (err) throw err;
                    const feurCount = row.feur;
                    embed.setDescription(`J'ai répondu **${feurCount} feur** depuis le **${date.date}**`)
                    interaction.reply({ embeds: [embed] });
                })
            }
        } catch (error) {   
            console.log(error);
            errorEmbed.setDescription(`Merci de contacter le support\n\`\`\`${error}\`\`\``)
            interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
}