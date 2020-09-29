const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.BOT_APIKEY, { polling: true });
const axios = require('axios');
const TinyURL = require('tinyurl');

const User = require('../models/user');
const Tutorial = require('../models/tutorial');

// Welcome Message
bot.onText(/\/start/, (msg) => {
  (async () => {
    let exists = await User.findOne({ username: msg.from.username });
    if (!exists) {
      new User({
        firstname: msg.from.first_name,
        lastname: msg.from.last_name,
        username: msg.from.username,
      }).save();
    }
  })();

  bot.sendMessage(
    msg.chat.id,
    `*Hi ${msg.from.first_name}*, Welcome to Tutorial Downloader Bot! 🤖 \n \n`,
    { parse_mode: 'Markdown' }
  );

  setTimeout(() => {
    bot.sendMessage(
      msg.chat.id,
      `What do you wanna do today🤗\n\nTo download tutorial enter name eg. _Modern JavaScript From The Beginning._ \n/steps 👣 \n/random 🧐\n/\help ℹ️\n/donate ❤️`,
      { parse_mode: 'Markdown' }
    );
  }, 1000);
});

// Process Tutorial download
bot.on('message', (msg) => {
  let tutorial = msg.text;
  let chatId = msg.chat.id;

  if (
    tutorial !== '/start' &&
    tutorial !== '/help' &&
    tutorial !== '/random' &&
    tutorial !== '/donate' &&
    tutorial !== '/steps'
  ) {
    // Get Data
    (async () => {
      try {
        // Set Laoding
        bot.sendMessage(chatId, '_Looking for _' + tutorial + '...', {
          parse_mode: 'Markdown',
        });

        const res = await axios.get(
          `${process.env.APP_URL}/search?q=${tutorial}`
        );

        if (res.data.results.length === 0) {
          bot.sendMessage(
            chatId,
            `Sorry, but nothing matched your search terms. Please try again with some different keywords.`
          );
        } else {
          new Tutorial({
            username: msg.from.username,
            tutorial: tutorial,
          }).save();
          getDownloadURL(res.data.results);
        }
      } catch (error) {
        console.log(error);
        bot.sendMessage(
          chatId,
          `Sorry, but nothing matched your search terms. Please try again with some different keywords.`
        );
      }
    })();

    // Return response to user with information and URL
    const getDownloadURL = (data) => {
      data.splice(0, 5).forEach((tutorial) => {
        const { title, link, image, date } = tutorial;

        // Initial URL
        const initURL = link;

        // shorten Init URL
        TinyURL.shorten(initURL, function (res, err) {
          if (err) console.log(err);

          // Shortend URL
          let shortendURL = res;

          const options = {
            caption: `\nTitle: ${title} \nDate: ${date} \n\n🚀 Download Here: ${shortendURL} \n \nGet regular udemy courses for free here https://t.me/tuthive_bot`,
            reply_markup: JSON.stringify({
              inline_keyboard: [[{ text: 'Download', url: shortendURL }]],
            }),
          };

          bot.sendPhoto(chatId, image, options);
        });
      });
    };
  }
});

// Process Tutorial Random
bot.onText(/\/random/, (msg, match) => {
  let chatId = msg.chat.id;

  // Get Data
  (async () => {
    try {
      // Set Laoding
      bot.sendMessage(chatId, 'fetching random tutorials...', {
        parse_mode: 'Markdown',
      });
      const res = await axios.get(`${process.env.APP_URL}/search?q=`);

      if (res.data.results.length === 0) {
        bot.sendMessage(
          chatId,
          `Sorry, but nothing matched your search terms. Please try again with some different keywords.`
        );
      } else {
        getDownloadURL(res.data.results);
      }
    } catch (error) {
      console.log(error);
      bot.sendMessage(
        chatId,
        `Sorry, but nothing matched your search terms. Please try again with some different keywords.`
      );
    }
  })();

  // Return response to user with information and URL
  const getDownloadURL = (data) => {
    data.splice(0, 5).forEach((tutorial) => {
      const { title, link, image, date } = tutorial;

      // Initial URL
      const initURL = link;

      // shorten Init URL
      TinyURL.shorten(initURL, function (res, err) {
        if (err) console.log(err);

        // Shortend URL
        let shortendURL = res;

        const options = {
          caption: `\nTitle: ${title} \nDate: ${date} \n\n🚀 Download Here: ${shortendURL} \n \nDownload your tutorial with ease here https://t.me/tuthive_bot`,
          reply_markup: JSON.stringify({
            inline_keyboard: [[{ text: 'Download', url: shortendURL }]],
          }),
        };

        bot.sendPhoto(chatId, image, options);
      });
    });
  };
});

// Get donate addresses
bot.onText(/\/donate/, (msg, match) => {
  let chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Tutorial Downloader Bot is free to use meaning you don't ever pay to use the service. However, we accept donations to keep our servers and scrapers working. Feel free to donate to the service with cryptocurrency ❤️ \n\nBitcoin: *${process.env.BITCOIN_ADDRESS}* \n\nEthereum: *${process.env.ETHEREUM_ADDRESS}* \n\nBitcoin Cash: *${process.env.BITCOINCASH_ADDRESS}*`,
    {
      parse_mode: 'Markdown',
    }
  );
});

// Get instructions
bot.onText(/\/help/, (msg, match) => {
  let chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Instructions for using Tutorial Downloader ℹ️\n\n/start - start the bot\nTo download tutorial enter name eg. _Modern JavaScript..._ \n/random - get random tutorials\n/donate - donate to the bot\n/help - learn how the bot works`,
    {
      parse_mode: 'Markdown',
    }
  );
});

// Get Steps to download course
bot.onText(/\/steps/, (msg, match) => {
  let chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Steps on how to Download a course ℹ️\n\n1. Enter name eg. _Modern JavaScript..._ \n2. Click the download link to get the torrent file\n3. Use winRAR to extract the zip file and open the torrent file to start downloading`,
    {
      parse_mode: 'Markdown',
    }
  );
});

bot.on('polling_error', (err) => console.log(err));
