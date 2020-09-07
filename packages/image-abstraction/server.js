const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const googleImages = require('google-images');
const mongoose = require('mongoose');
const pug = require('pug');

const clientPublic  = require('./routes/api.js');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(cors());
app.use(helmet());
app.set('view engine', 'pug');

mongoose.connect(process.env.DB, { useNewUrlParser: true }, (err, db) => {
   clientPublic(app, db);
})

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

module.exports = app;