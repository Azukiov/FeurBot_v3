const { InteractionType, EmbedBuilder, ChannelType, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { readdirSync, read } = require('fs');
const db = require('../db');

module.exports = {
    name: 'interactionCreate',

    async execute(interaction) {
        let client = interaction.client;


        if (interaction.type == InteractionType.ApplicationCommand) {
            if (interaction.channel.type == 'DM') return;
            if (interaction.user.bot) return;

            readdirSync('./commands').forEach(file => {
                const command = require(`../commands/${file}`);
                if (interaction.commandName.toLowerCase() === command.data.name.toLowerCase()) {
                    try {
                        command.run(client, interaction)
                    } catch (error) {
                        interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
                    }
                }
            })
        }
    }
}