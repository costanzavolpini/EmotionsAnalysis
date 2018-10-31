/** @module models/index.js
* Loads all models
*/
'use strict';

const mongoose = require('mongoose');

require('./Artwork');
require('./Artist');
// require('./User');

module.exports = {
  'Artwork' : mongoose.model('Artwork'),
  'Artist' : mongoose.model('Artist'),
  // 'User' : mongoose.model('User')
}

