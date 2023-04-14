const { EmbedBuilder } = require('discord.js')

const errorEmbed = new EmbedBuilder()
    .setColor("#ff0000")
    .setAuthor({ name: `Une erreur est survenue` })

module.exports = errorEmbed;