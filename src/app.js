const { Client } = require('discord.js-selfbot-v13');
const TelegramBot = require('node-telegram-bot-api');
require("dotenv").config();

const discordClient = new Client();
const telegramBot = new TelegramBot(process.env.telegramToken, { polling: false });

discordClient.on('ready', async () => {
  console.log(`${discordClient.user.username} is ready!`);
})


discordClient.on('message', message => {
    // Check if the message is from a specific user or in a specific channel
    
    if (message.channel.id === process.env.discordChannelId) {
      // Redirect the message to another channel
      
      telegramBot.sendMessage(process.env.telegramChannelId, message.content);
      
    }
  });

discordClient.login(process.env.discordToken);