require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
var logger = require('morgan');



const bodyParser = require('body-parser').urlencoded({extended: true});
const dns = require('dns');
const URL = require('./models');

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser);
app.use(logger('dev'));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});



app.post('/api/shorturl/new', (request, response) => {
  console.log(request.body);
  const originalUrl = request.body.url;
  if(originalUrl.match(/^https?:\/\//i)){
    new URL({ original_url: originalUrl }).save()
      .then(urlObject => {
        response.json({ original_url: urlObject.original_url, short_url: urlObject.short_url });
      });
    }
    else{
      response.json({ "error": "invalid URL" });

    }
});

app.get('/api/shorturl/:shorturl', (request, response) => {
  let num = request.params.shorturl * 1;
  if(isNaN(num)){
    response.json({ "error": "invalid URL" });
    return;
  }
  URL.findOne({ short_url: request.params.shorturl })
    .then(urlObject => {
      let originalUrl = urlObject.original_url;
      if (!originalUrl.match(/http/)) {
        originalUrl = `https://${originalUrl}`;
      }
      response.redirect(originalUrl);
    });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

