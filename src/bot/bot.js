const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.BOT_APIKEY, { polling: true });
const axios = require('axios');
const TinyURL = require('tinyurl');

const User = require('../models/user');
const Tutorial = require('../models/tutorial');

// Welcome Message
bot.onText(/\/start/, async (msg) => {
  let exists = await User.findOne({ username: msg.from.username });
  if (!exists) {
    new User({
      firstname: msg.from.first_name,
      lastname: msg.from.last_name,
      username: msg.from.username,
      chatId: msg.chat.id,
    }).save();
  }

  bot.sendMessage(
    msg.chat.id,
    `*Hi ${msg.from.first_name}*, Welcome to Get free course Bot! 🤖 \n \n`,
    { parse_mode: 'Markdown' }
  );

  setTimeout(() => {
    bot.sendMessage(
      msg.chat.id,
      `What do you wanna do today🤗\n\nTo download course enter name eg. _Modern JavaScript From The Beginning._ \n/steps 👣 \n/random 🧐\n/\help ℹ️\n/donate ❤️`,
      { parse_mode: 'Markdown' }
    );
  }, 1000);
});

// Process Tutorial download
bot.on('message', (msg) => {
  let tutorial = msg.text;
  let chatId = msg.chat.id;
  let username = msg.from.username;

  if (
    tutorial !== '/start' &&
    tutorial !== '/help' &&
    tutorial !== '/random' &&
    tutorial !== '/donate' &&
    tutorial !== '/steps' &&
    !tutorial.includes('broadcast')
  ) {
    // Get Data
    (async () => {
      const userChatId = await User.findOne({ chatId });
      if (!userChatId) {
        const user = await User.findOne({ username });
        if (user) {
          user.chatId = chatId;
          user.save();
        }
      }

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
      data.splice(0, 10).forEach((tutorial) => {
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

// Process courses Randomly
bot.onText(/\/random/, (msg, match) => {
  let chatId = msg.chat.id;

  // Get Data
  (async () => {
    try {
      // Set Laoding
      bot.sendMessage(chatId, 'fetching random courses...', {
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
    `Get free course Bot is free to use meaning you don't ever pay to use the service. However, we accept donations to keep our servers and scrapers working. Feel free to donate to the service with cryptocurrency ❤️ \n\nBitcoin: *${process.env.BITCOIN_ADDRESS}* \n\nEthereum: *${process.env.ETHEREUM_ADDRESS}* \n\nBitcoin Cash: *${process.env.BITCOINCASH_ADDRESS}*`,
    {
      parse_mode: 'Markdown',
    }
  );
});

// Get instructions
bot.onText(/\/help/, async (msg, match) => {
  const users = await User.find({});
  const tutorials = await Tutorial.find({});
  let chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Instructions for using Get free course Bot ℹ️\n\n/start - start the bot\nTo download tutorial enter name eg. _Modern JavaScript..._ \n/steps - how to download course \n/random - get random tutorials\n/donate - donate to the bot\n/help - learn how the bot works\n\n👥 Bot Users - ${users.length}\n☁️ Courses Fetched - ${tutorials.length}`,
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
    `Steps on how to Download a course ℹ️\n\n1. Enter name eg. _Modern JavaScript_, list of tutorial related to your search will be displayed.\n2. Click on the one you would like to download, the link will redirect you to start downloading.\n\nIn some case you have to \n-Download uTorrent for phone here https://www.utorrent.com/downloads \n-Download uTorrent for PC here https://utorrent.en.softonic.com/download\n3. After successfully downloading, Use winRAR to extract the zip/rar file and start downloading the course.\n\n _Enjoy the course._`,
    {
      parse_mode: 'Markdown',
    }
  );
});

// Broadcast Message
bot.onText(/\/broadcast (.+)/, async (msg, match) => {
  const message = match[1];
  const isAdmin = await User.findOne({ username: msg.from.username });

  if (isAdmin.admin === false) {
    bot.sendMessage(msg.chat.id, `You can't perform this action`, {
      parse_mode: 'Markdown',
    });
  } else {
    const users = await User.find({});
    users.map((user) => {
      bot.sendMessage(user.chatId, `${message}`, {
        parse_mode: 'Markdown',
      });
    });
  }
});

bot.on('polling_error', (err) => console.log(err));
