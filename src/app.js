const express = require('express');
const scrapper = require('./scrapper/scrapper');
require('./db/mongoose');

const app = express();

const PORT = process.env.PORT || 5000;

// API route

app.get('/api/search', (req, res) => {
  scrapper
    .tutorial(req.query.q)
    .then((x) => res.json(x))
    .catch((e) => res.send(e));
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
