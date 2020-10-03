const request = require('request');
const cheerio = require('cheerio');

// Free Tutorials US
const downloadly = async (title) => {
  return new Promise((resolve, reject) => {
    const newTitle = title.replace(/\s+/g, '+');
    const url = `https://downloadly.net/?s=${newTitle}`;
    let options = {
      url: url,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
      },
    };

    request(options, (error, response, html) => {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);
        let json = {
          results: [],
          version: require('../../package.json').version,
        };

        $('.post').each((i, el) => {
          const id = i;
          const title = $(el).find('.post_title').text();
          const link = $(el).find('.post_title a').attr('href');
          const image = $(el).find('.wp-post-image').attr('data-src');
          const date = $(el).find('.post_date').text();
          json.results.push({ id, title, image, link, date });
        });

        // Check is Result is []
        if (json.results.length === 0) {
          freetutorialsus(title);
        }

        return resolve(json);
      }

      resolve({ error: error });
    });
  });
};

// Free Tutorials US
const freetutorialsus = async (title) => {
  return new Promise((resolve, reject) => {
    const newTitle = title.replace(/\s+/g, '+');
    const url = `https://www.freetutorialsus.com/?s=${newTitle}`;
    let options = {
      url: url,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
      },
    };

    request(options, (error, response, html) => {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);
        let json = {
          results: [],
          version: require('../../package.json').version,
        };

        $('.post-box').each((i, el) => {
          const id = i;
          const title = $(el).find('.post-title').text();
          const link = $(el).find('.readmore a').attr('href');
          const image = $(el).find('.wp-post-image').attr('src');
          const date = $(el).find('.entry-date').text();
          json.results.push({ id, title, image, link, date });
        });

        // Check is Result is []
        if (json.results.length === 0) {
          freecoursesite(title);
        }

        return resolve(json);
      }

      resolve({ error: error });
    });
  });
};

// Free Course Site
const freecoursesite = async (title) => {
  return new Promise((resolve, reject) => {
    const newTitle = title.replace(/\s+/g, '+');
    const url = `https://freecoursesite.com?s=${newTitle}`;
    let options = {
      url: url,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
      },
    };

    request(options, (error, response, html) => {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);
        let json = {
          results: [],
          version: require('../../package.json').version,
        };
        $('.item-inner').each((i, el) => {
          const id = i;
          const title = $(el).find('.post-title').text();
          const link = $(el).find('.post-url').attr('href');
          const imgStyle = $(el).find('.img-holder').attr('style').split('(');
          const image = imgStyle[1].split(')')[0];
          const date = $(el).find('.time').text();
          json.results.push({ id, title, image, link, date });
        });

        // Check is Result is []
        if (json.results.length === 0) {
          freetutorialsus(title);
        }

        return resolve(json);
      }

      resolve({ error: error });
    });
  });
};

module.exports.tutorial = downloadly;
