const express = require('express');
const scrapper = require('./scrapper/scrapper');
const packageInfo = require('../package.json');
require('./db/mongoose');
require('./bot/bot');

const app = express();

const PORT = process.env.PORT || 5000;

// API route

app.get('/', function (req, res) {
  res.json({
    message: 'Welcome to Get free course Bot',
    link: 'https://t.me/tuthive_bot',
    version: packageInfo.version,
  });
});

app.get('/api/search', (req, res) => {
  scrapper
    .tutorial(req.query.q)
    .then((x) => res.json(x))
    .catch((e) => res.send(e));
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
