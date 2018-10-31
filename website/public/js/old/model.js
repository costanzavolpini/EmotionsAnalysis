function shouldExist(name, val, shouldBeArray){
  shouldBeArray = shouldBeArray || false;
  if ("undefined" == typeof val 
      || val === null
      || val.toString === ''){
    throw new Error( name + " should exist and not be empty")
  }

  if(shouldBeArray
     && !(val instanceof Array)){
    throw new Error( name + " should be an Array");
  }
}

/**
* Creates a user object.
* @constructor
* @param {string} _id The unique identifier of the user
* @param {string} userName The username of the user
* @param {string} email The email address of the user
* @param {string} password The password for the user account
* @param {string} [firstName] The first name of the user. Default: username
* @param {string} [lastName] The last name of the user. Default: username
* @param {Date} [date_created] The date the user was created.  Default: Date.now()
* @param {Array} [playlists] The playlists of the user. Default: []
* @returns {Object} The newly created user instance
*/
function user(_id, userName, email, password, firstName, lastName, date_created, playlists){
  //required
  shouldExist("_id", _id);
  shouldExist("userName", userName);
  shouldExist("email", email);
  shouldExist("password", password);

  //defaults
  firstName = firstName || userName;
  lastName = lastName || userName;
  date_created = date_created || Date.now();
  playlists = playlists || [];

  return {
    "_id"          : _id,
    "firstName"    : firstName,
    "lastName"     : lastName,
    "userName"     : userName,
    "email"        : email,
    "password"     : password,
    "date_created" : date_created,
    "playlists"    : playlists
  };
}

/**
* Creates a track object.
* @constructor
* @param {string} _id The unique identifier of the track
* @param {string} name The song name
* @param {string} artist The artist who performs or composed the track. It should be the `_id` of an artist object.
* @param {Number} duration The duration of the track in seconds
* @param {string} file The url of the location of the mp3 file of the track
* @param {string} [album] The album this track is in. It should be the `_id` of an album object. Default: ''
* @param {Array} [id3Tags] An array of the id3Tags of the mp3 file of the track. Default: []
* @param {Date} [release_date] The date the track was released. Default: Date.now()
* @param {Date} [date_created ]The date the track was created. Default: Date.now()
* @returns {Object} The newly created track instance
*/
function track(_id, name, artist, duration, file, album, id3Tags, release_date, date_created){
  //required
  shouldExist("_id", _id);
  shouldExist("name", name);
  shouldExist("artist", artist);
  shouldExist("file", file);
  shouldExist("duration", duration);

  //defaults
  album = album || '';
  id3Tags = id3Tags || [];
  release_date = release_date || Date.now();
  date_created = date_created || Date.now();
 
  return {
    "_id"          : _id,
    "artist"       : artist,
    "album"        : album,
    "name"         : name,
    "duration"     : duration,
    "file"         : file,
    "id3Tags"      : id3Tags,
    "release_date" : release_date,
    "date_created" : date_created
  };
}

/**
* Creates an artist object.
* @constructor
* @param {string} _id The unique identifier of the artist
* @param {string} name The full name of the artist or band
* @param {string} [genre] The genre of the artist. Default: 'rock'
* @param {string} [artwork] The URL of the artwork picture for the artist.  Default: ''
* @param {Date} [date_created] The date the artist was created. Default: Date.now()
* @returns {Object} The newly created artist instance
*/
function artist(_id, name, genre, artwork, date_created){
  //required
  shouldExist("_id", _id);
  shouldExist("name", name);

  //defaults
  genre = genre || 'rock';
  artwork = artwork || '';
  date_created = date_created || Date.now();

  return {
    "_id"          : _id,
    "name"         : name,
    "genre"        : genre,
    "artwork"      : artwork,
    "date_created" : date_created
  };
}

/**
* Creates an abstractSoundCollection object.
* @constructor
* @param {string} _id The unique identifier of the abstractSoundCollection
* @param {string} name The name of the abstractSoundCollection
* @param {string[]} tracks The tracks that this abstractSoundCollection contains. They should be `_id`s of track objects.
* @param {Date} [date_created] The date the abstractSoundCollection was created. Default: Date.now()
* @returns {Object} The newly created abstractSoundCollection instance
*/
function abstractSoundCollection(_id, name, tracks, date_created){
  //required
  shouldExist ("_id", _id);
  shouldExist ("name", name);

  //defaults
  date_created = date_created || Date.now();
  tracks = tracks || [];

  return {
    "_id"          : _id,
    "name"         : name,
    "tracks"       : tracks,
    "date_created" : date_created,
  };
}

/**
* Creates an album object.
* @constructor
* @param {string} _id The unique identifier of the album
* @param {string} name The name of the album
* @param {string} artist The artist who performs in this album. It should be the `_id` of an artist object.
* @param {string} artwork The URL of the artwork picture for the album
* @param {string[]} tracks The tracks that this album contains. They should be `_id`s of track objects.
* @param {Date} [date_created] The date the album was created. Default: Date.now()
* @param {Date} [release_date] The date the album was released. Default: Date.now()
* @param {string} [label] The record label of this album. Default: 'USI-INF records'
* @returns {Object} The newly created album instance
*/
function album(_id, name, artist, artwork, tracks, date_created, release_date, label){
  //super
  var that = abstractSoundCollection(_id, name, tracks, date_created);

  //required
  shouldExist("artwork", artwork);
  shouldExist("artist", artist);

  //defaults
  release_date = release_date || Date.now();
  label = label || 'USI-INF records';

  that.artist = artist;
  that.artwork = artwork;
  that.release_date = release_date;
  that.label = label;
  return that;
}

/**
* Creates a playlist object.
* @constructor
* @param {string} _id The unique identifier of the playlist
* @param {string} name The name of the playlist
* @param {string} owner The owner of this playlist. It should be the `_id` of a user object.
* @param {string[]} tracks The tracks that this playlist contains. They should be `_id`s of track objects.
* @param {Date} [date_created] The date the playlist was created. Default: Date.now()
* @returns {Object} The newly created playlist instance
*/
function playlist(_id, name, owner, tracks, date_created){
  //super
  var that = abstractSoundCollection(_id, name, tracks, date_created);

  //required
  shouldExist("owner", owner);

  that.owner = owner;
  return that;
}


/**
* saves a playlist in localStorage
* - Each playlist is an object with the same schema as model playlists. That is, it has
* the following properties: _id, owner, name, tracks, date_created.
*
* - The playlist is stored in localStorage.playlists[_id]
*
* @param {playlist} pl The playlist instance to save
*/

function savePlaylist(pl){
  //persist playlist
  var playlists =  JSON.parse(localStorage.playlists);
  playlists[pl._id] = pl
  localStorage.playlists = JSON.stringify(playlists);
}

/**
* This function helps us search the library.
* It iterates over the arr of  objects. For each object it checks if the
* 'prop' in property has term as a substring, . For example, by searching
* "clair", I might find "The Clairvoyant".
* @param {Array}  arr  Array of objects to search
* @param {String} prop The property to be searched inside the objects
* @param {String} term The term that has to match for the search to succeed
* @returns {Array} An array of matching objects
*/
function fuzzyFind(arr, prop, term){
  var res = [];
  arr.forEach(function(item){
      if(item[prop].toLowerCase().indexOf(term.toLowerCase()) >=0){
        res.push(item);
      }
  });
  return res;
}