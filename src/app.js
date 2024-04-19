const { Client } = require('discord.js-selfbot-v13');
const TelegramBot = require('node-telegram-bot-api');
require("dotenv").config();
const axios = require('axios');

const discordClient = new Client();
const telegramBot = new TelegramBot(process.env.telegramToken, { polling: false });

const silentOptions = {
  parse_mode: 'Markdown',
  disable_notification: true // Set to true for a silent notification
};

discordClient.on('ready', async () => {

  console.log(`${discordClient.user.username} is ready!`);

  /*const channelId = '1228077883243630654';
  /*const channelId = '1228077883243630654';
  //const messageId = '1230563588989652993'; // PvP
  //const messageId = '1230458800155262997' // Raid
  //const messageId = '1230484717573505064' // 0%
  //const messageId = '1230328806120886375' // Rocket
  const messageId = '1230941528524980275' // Random
  //const messageId = '1230627297539657828' // Empty
  //const messageId = '1230488059485622343' // WeatherChange

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

    */
    */
    
    


})

async function sendMessage(telegramChatId, message) {
  let messageToSend = "";
  try{
  messageToSend = "*" + message.embeds[0].title + "*\n";
  messageToSend += message.embeds[0].description;
  messageToSend = messageToSend.split("<:gmaps")[0];
  
    //messageToSend = messageToSend.replace(/<:TeamHarmony:\d+>/, '');
    messageToSend = messageToSend.replace(/<:[^>]+:\d+>/g, 'Team');
    messageToSend = messageToSend.replace("Team", "");
    messageToSend = messageToSend.replace(/Despawn <t:\d+:R>/, "\n");


    
    
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


  }
  catch(error){
    console.log("Test")
    return;
  }

  

  

  
  messageToSend = messageToSend.split("<:gmaps")[0];

  messageToSend = messageToSend.replaceAll("**", "*");

  //console.log(messageToSend);

  let longitude, latitude;
  try{
    const coordinates = await getCoordinates(getGoogleMapsLink(message));
    longitude = parseFloat(coordinates[0]);
    latitude = parseFloat(coordinates[1]);
  }
  catch(error){
    console.log("Test2");
  }
  
  try{
    await telegramBot.sendPhoto(telegramChatId, message.embeds[0].image.url)
  }
  catch(error){
    console.error("Coul not send photo");
  }
  try{
    await telegramBot.sendMessage(telegramChatId, messageToSend, silentOptions)
  }
  catch(error){
    console.error("Coul not send message");
  }
  try{
    await telegramBot.sendLocation(telegramChatId, longitude, latitude, silentOptions)
  }
  catch(error){
    console.error("Coul not send location");
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
    try{
      return message.embeds[0].description.split("[Google](")[1]

    }
    catch(error){
      console.log("Test3");
    }
    //return null;
  }
  //
  return googleMapsLink;
}

async function getCoordinates(coordPogomapperUrl) {
  try {
    const response = await axios.get(coordPogomapperUrl);

    //console.log(response.toString());
    const coordinates = response.request.path.slice(response.request.path.indexOf('q=') + 2, response.request.path.indexOf('&uc')).split(',');



    //const longitude = coordinates[0];

    //const latitude = coordinates[1];


    //const googleMapsUrl = responseString.slice(startIndex + 1, endIndex);
    return coordinates;
  }
  catch (error) {
    return null;
  }
}


discordClient.on('messageCreate', async message => {
  // Check if the message is from a specific user or in a specific channel
  let telegramChatId;

  if (message.channel.id === process.env.discordChannelId) {
    telegramChatId = process.env.telegramTestId;
  }
  else if (message.channel.id === process.env.discordBidoofId) {
    telegramChatId = process.env.telegramMyId;
  }
  else {
    return;
  }
  try{
    sendMessage(telegramChatId, message);
  }
  catch(error){
    console.error("Could not send messages");
  }






});

discordClient.login(process.env.discordToken);
