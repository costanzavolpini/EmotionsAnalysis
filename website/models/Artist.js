/** @module models/Artist
* The Artist Model
* Schema:
* _id            ObjectId     Unique identifier of the artist
* name           String       Full name of the artist
* artworks        [ObjectId]  list of artworks ids
*/

'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

/** @constructor
* @param {Object} definition
*/
const ArtistSchema = new mongoose.Schema(

{
  name : { type: String, required: true },
  artworks: { type: ObjectId, ref:"Artwork", default: "" },
}
);

//register model
mongoose.model('Artist', ArtistSchema);
