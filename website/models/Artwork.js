/** @module models/workart
* The Album Model.
* Schema:
* _id            String       required   Unique identifier of the workart
* name           String       required   Name of the painting
* floor          Number          optional   Floor
* artist         ObjectId     required   Artist
* emotions       [String]     optional   Emotions
*/


'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


/** @constructor
* @augments AbstractSoundCollectionSchemaInstance
* @param {Object} definition
*/
const ArtworkSchema = new mongoose.Schema(

{
  name : { type: String, required: true },
  floor : { type: Number, required: false },
  artist : { type: ObjectId, ref:"Artist", required: true },
  emotions : { type: String, default: 'neutral' },
}

);


//register model
mongoose.model('Artwork', ArtworkSchema);
