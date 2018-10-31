//Costanza Volpini
const config = require('./config');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const methodOverride = require('method-override');

// Connect to MongoDB here
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(config.mongoUrl + config.mongoDbName);

// // Register model definition here
// const userSchema = require('./models/User');
// const PlaylistSchema = require('./models/Playlist');
// const trackSchema = require('./models/Track');
// const ArtistSchema = require('./models/Artist');
// const AlbumSchema = require('./models/Album');

//configure app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));    // parse application/x-www-form-urlencoded
app.use(bodyParser.json());    // parse application/json
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride(
function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method
    delete req.body._method
    return method
  }
}
));

//root URL
const RootRoute = require('./routes/root');
app.use('/', RootRoute);

// const artistRoute = require('./routes/artist');
// app.use('/artists', artistRoute);

// const trackRoute = require('./routes/track');
// app.use('/tracks', trackRoute);

// const albumRoute = require('./routes/album');
// app.use('/albums', albumRoute);

// const userRoute = require('./routes/user');
// app.use('/users', userRoute);

// Initialize routers here
module.exports = app;
