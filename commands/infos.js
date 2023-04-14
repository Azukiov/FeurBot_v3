const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const moment = require('moment');
const errorEmbed = require('../embeds');
const { data } = require('../data');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('infos')
        .setDescription('Affiche les informations du bot.'),

    run: async (client, interaction) => {
        try {
            const embed = new EmbedBuilder()
                .setColor(data.colors.base)

            const guilds = client.guilds.cache.size;
            const users = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
            const dateCreation = moment(client.user.createdAt).format('DD/MM/YYYY à HH:mm:ss');

            const uptime = client.uptime;
            const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
            const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
            const displayUptime = `${days} jours, ${hours} heures, ${minutes} minutes et ${seconds} secondes`;

            const latency = Date.now() - client.readyAt
            const commands = client.commands.map(command => command.data.name);

            embed.setDescription('Informations du bot')
                .addFields(
                    { name: `Développeur`, value: `!"Its_Azukio#8075`},
                    { name: `Version`, value: `3.0`, inline: true },
                    { name: `Serveurs`, value: `${guilds}`, inline: true },
                    { name: `Utilisateurs`, value: `${users}`, inline: true },
                    { name: `Date de création`, value: `${dateCreation}` },
                    { name: `Uptime`, value: `${displayUptime}` },
                    { name: `Latence`, value: `${latency}ms`, inline: true },
                    { name: `Commandes`, value: `${commands.length}`, inline: true },
                )

            const msg = await interaction.reply({ embeds: [embed] });
            setTimeout(() => {
                interaction.deleteReply();
            }, 60000);
        }
        catch (error) {
            console.log(error);
            errorEmbed.setDescription(`Merci de contacter le support\n\`\`\`${error}\`\`\``)
            interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
}