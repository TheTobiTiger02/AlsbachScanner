const { Client } = require('discord.js-selfbot-v13');
const TelegramBot = require('node-telegram-bot-api');
require("dotenv").config();
const axios = require('axios');
const cheerio = require('cheerio');

const discordClient = new Client();
const telegramBot = new TelegramBot(process.env.telegramToken, { polling: false });

discordClient.on('ready', async () => {
  console.log(`${discordClient.user.username} is ready!`);

})

async function getCoordinates(coordPogomapperUrl) {
  try {
    const response = await axios.get(coordPogomapperUrl);

    //console.log(response.toString());
    const coordinates = response.request.path.slice(response.request.path.indexOf('q=') + 2, response.request.path.indexOf('&uc')).split(',');



    //const longitude = coordinates[0];

    //const latitude = coordinates[1];


    //const googleMapsUrl = responseString.slice(startIndex + 1, endIndex);
    return coordinates;
  } catch (error) {
    console.error('Error retrieving Google Maps URL:', error);
    return null;
  }
}


discordClient.on('message', async message => {
  // Check if the message is from a specific user or in a specific channel

  if (message.channel.id === process.env.discordChannelId) {

    try {
      const text = message.embeds[0].fields[1].value;
      const links = text.split(' | ');

      let googleMapsLink;
      for (const link of links) {
        if (link.includes('Google')) {
          const matches = link.match(/\(([^)]+)\)/);
          if (matches && matches.length > 1) {
            googleMapsLink = matches[1];
            googleMapsLink = googleMapsLink.replace('<', '');
            googleMapsLink = googleMapsLink.replace('>', '');
            break;
          }
        }
      }

      const coordinates = await getCoordinates(googleMapsLink);
      const longitude = parseFloat(coordinates[0]);
      const latitude = parseFloat(coordinates[1]);

      telegramBot.sendPhoto(process.env.telegramChannelId, message.embeds[0].thumbnail.url)
        .then(() => telegramBot.sendMessage(process.env.telegramChannelId, message.content))
        .then(() => telegramBot.sendLocation(process.env.telegramChannelId, longitude, latitude))
        .then(() => {
          //console.log('All messages sent successfully.');
        })
        .catch(error => {
          console.error('Error sending messages:', error);
        });
      //telegramBot.sendMessage(process.env.telegramChannelId, message.content)
      //.then(telegramBot.sendPhoto(process.env.telegramChannelId, message.embeds[0].image.url))
      // .then(telegramBot.sendLocation(process.env.telegramChannelId, longitude, latitude));
      




      // Redirect the message to another channel
      //telegramBot.sendPhoto(process.env.telegramChannelId, message.embeds[0].thumbnail.url);
      //telegramBot.sendMessage(process.env.telegramChannelId, finalUrl);
      //telegramBot.sendPhoto(process.env.telegramChannelId, message.embeds[0].image.url);   

      //console.log(message.embeds[0].fields[1].value.split);
      //console.log(message.embeds[0].image.url);
      //console.log(message.embeds[0].thumbnail.url);

    }
    catch (error) {
      console.log(error);
    }
    // Redirect the message to another channel
    try {





    }
    catch (error) {
      console.log(error.message);
    }


  }
});

discordClient.login(process.env.discordToken);