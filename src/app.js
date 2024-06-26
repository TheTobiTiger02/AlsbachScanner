const { Client } = require('discord.js-selfbot-v13');
const TelegramBot = require('node-telegram-bot-api');
require("dotenv").config();
const axios = require('axios');
const request = require('request');


const discordClient = new Client();
const telegramBot = new TelegramBot(process.env.telegramToken, { polling: false });

const silentOptions = {
  parse_mode: 'Markdown',
  disable_notification: true // Set to true for a silent notification
};

var currentDate = new Date();
var dateOptions = { timeZone: 'Europe/Berlin' };
var formattedDate = currentDate.toLocaleString('ger', dateOptions);

discordClient.on('ready', async () => {

  console.log(`${discordClient.user.username} is ready!`);

  

  //testMessage();
  

})

async function testMessage() {
  const channelId = '1228077883243630654';
  //const messageId = '1230969067695767734'; // PvP
  //const messageId = '1230458800155262997' // Raid
  //const messageId = '1230484717573505064' // 0%
  //const messageId = '1230328806120886375' // Rocket
  const messageId = '1234166857158885386' // Random
  //const messageId = '1230627297539657828' // Empty
  //const messageId = '1230488059485622343' // WeatherChange
  //const messageId = '1231731003631079486' // Hundo

  // Fetch the channel
  const channel = discordClient.channels.cache.get(channelId);

  // Fetch the message by its ID
  channel.messages.fetch(messageId)
    .then(message => {
      //telegramBot.sendMessage("449626954", message.embeds[0].title + '\n\n' + message.embeds[0].description.split('Despawn')[0].replaceAll('**', '') + '\n' + message.embeds[0].fields[1].value.split('<')[0])
      //telegramBot.sendMessage("449626954", message.embeds[0].description);
      //console.log(message.embeds[0].title);
      //console.log(message.embeds[0])
      sendMessage("449626954", message)

    })
    .catch(error => {
      console.error('Error fetching message:', error);
    });
}

async function sendMessage(telegramChatId, message) {
  let messageToSend = "";
  try {
    messageToSend = "*" + message.embeds[0].title + "*\n";
    messageToSend += message.embeds[0].description + "\n\n";
    messageToSend = messageToSend.split("<:gmaps")[0];

    //messageToSend = messageToSend.replace(/<:TeamHarmony:\d+>/, '');
    messageToSend = messageToSend.replace(/<:[^>]+:\d+>/g, 'Team');
    messageToSend = messageToSend.replace("Team", "");
    messageToSend = messageToSend.replace(/Despawn <t:\d+:R>/, "");




    message.embeds[0].fields.forEach(element => {
      //messageToSend += "*" + element.name + "*\n";
      messageToSend += element.value + "\n\n";
    });
    messageToSend = messageToSend
      .replaceAll(/<:BL\d+:\d+>/g, "") // Remove <:BL\d+:\d+>
      .replaceAll(/<:stardust:\d+>/g, "Stardust:") // Replace <:stardust:\d+> with "Stardust:"
      .replaceAll(/<:candies:\d+>/g, "Candies:") // Replace <:candies:\d+> with "Candies:"
      .replaceAll(/<:XLcandies:\d+>/g, "XL Candies:");

    messageToSend = messageToSend.replaceAll("\n ", "\n");
    messageToSend = messageToSend.replaceAll("\n\n", "\n");


  }
  catch (error) {
    return;
  }






  messageToSend = messageToSend.split("<:gmaps")[0];

  messageToSend = messageToSend.replaceAll("**", "*");

  //console.log(messageToSend);

  let longitude, latitude;
  try {
    const coordinates = await getCoordinates(getGoogleMapsLink(message));
    //console.log(coordinates[0])
    longitude = parseFloat(coordinates[0]);
    latitude = parseFloat(coordinates[1]);

    //console.log(longitude, latitude)
  }
  catch (error) {
  }
  

  try {
    await telegramBot.sendPhoto(telegramChatId, message.embeds[0].image.url)
  }
  catch (error) {
    console.error("Coul not send photo " + formattedDate);
  }
  try {
    await telegramBot.sendMessage(telegramChatId, messageToSend, silentOptions)
  }
  catch (error) {
    console.error("Coul not send message " + formattedDate);
  }
  try {
    await telegramBot.sendLocation(telegramChatId, longitude, latitude, silentOptions)
  }
  catch (error) {
    console.error("Coul not send location " + formattedDate);
  }
  /*try {
    telegramBot.sendPhoto(telegramChatId, message.embeds[0].image.url)
      .then(() => telegramBot.sendMessage(telegramChatId, messageToSend, silentOptions))
      .then(() => telegramBot.sendLocation(telegramChatId, longitude, latitude, silentOptions))
      .then(() => {
        //console.log('All messages sent successfully.');
      })
      .catch(error => {
        console.error('Error sending messages:', error);
      });
  }
  catch (error) {

  }
  */
}





function getGoogleMapsLink(message) {

  let googleMapsLink;

  try {
    const text = message.embeds[0].fields[1].value;
    //console.log(text)
    const links = text.split(' | ');


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
  }
  catch (error) {
    try {
      return message.embeds[0].description.split("[Google](")[1]
    }
    catch (error) {
    }
    //return null;
  }
  //

  return googleMapsLink;
}

async function getCoordinates(coordPogomapperUrl) {
  try {
    /*const response = await axios.get(coordPogomapperUrl);

    const coordinates = response.request.path.slice(response.request.path.indexOf('q=') + 2, response.request.path.indexOf('&uc')).split(',');

    console.log(coordinates)

    return coordinates;
    */
    

    let coordinates;
    await fetch(coordPogomapperUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        
        //const coordinatesStartIndex = data.indexOf('q=') + 2;
        //const coordinatesEndIndex = data.indexOf('&uc', coordinatesStartIndex);
        //const coordinatesSubstring = data.substring(coordinatesStartIndex, coordinatesEndIndex);
        const pattern = /-?\d+\.\d+,\s?-?\d+\.\d+/g;
        const matches = data.match(pattern);
        
        //coordinates = data.substring(data.indexOf("3D") + 2, data.indexOf("3D") + 20).split(",")
        coordinates = filterCoordinates(matches)
        coordinates = String(coordinates[0]).split(",");
        
        
      })
      .catch(error => {
        console.error(response);
      });

      return coordinates;

      








    //const longitude = coordinates[0];

    //const latitude = coordinates[1];


    //const googleMapsUrl = responseString.slice(startIndex + 1, endIndex);
  }
  catch (error) {
    return null;
  }
}

function filterCoordinates(coords) {
  const validCoordinates = [];

  coords.forEach(coord => {
      const [latitude, longitude] = coord.split(",").map(parseFloat);
      // Define reasonable ranges for latitude and longitude
      if (
          latitude >= -90 && latitude <= 90 &&
          longitude >= -180 && longitude <= 180
      ) {
          validCoordinates.push([latitude, longitude]);
      }
  });

  return validCoordinates;
}


discordClient.on('messageCreate', async message => {
  // Check if the message is from a specific user or in a specific channel
  let telegramChatId;

  currentDate = new Date();
  formattedDate = currentDate.toLocaleString('ger', dateOptions);

  if (message.channel.id === process.env.discordChannelId) {
    telegramChatId = process.env.telegramChannelId;
  }
  else if (message.channel.id === process.env.discordBidoofId) {
    telegramChatId = process.env.telegramMyId;
  }
  else {
    return;
  }
  try {
    sendMessage(telegramChatId, message);
  }
  
  catch (error) {
    console.error("Could not send messages: " + formattedDate);
  }






});





discordClient.login(process.env.discordToken);
