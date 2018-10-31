//Costanza Volpini
/** @module routes/abook */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Track')
const Track = mongoose.model('Track');

//GET /<modelname>
//lists all instances of the model
router.get('/', function(req, res) {
    Track.find({}, function(err, found) {
        if (!(found) || err) {
            return res.sendStatus(404);
        }
        res.status(200);
        res.json(found);
    });
});

//GET /<modelname>/:id
//lists the model instance that matches the id
router.get('/:id', function(req, res) {
    let id = req.params.id;
    Track.findById({"_id" : id}, function(err, found) {
        if (!(found) || err) {
            return res.sendStatus(404);
        }
        res.status(200);
        res.json(found);
    });
});

//DELETE /<modelname>/:id
//delete the model instance that matches the id
router.delete('/:id', function(req, res) {
    let id = req.params.id;
    let rem = {};
    Track.findById({"_id" : id}, function(err, found) {
        if (!(found) || err) {
            return res.sendStatus(404);
        }
        found.remove(function(err) {
            res.sendStatus(204);
        });
    });
})

//POST /<modelname>
//create a new model Instance and sends it as the response of the request
router.post('/', function(req, res) {
    if ((!req.body.name) || (!req.body.artist) || (!req.body.duration) || (!req.body.file)) {
        return res.status(400).json({});
    }
    const newTrack = new Track({
        name: req.body.name,
        artist: req.body.artist,
        duration: req.body.duration,
        file: req.body.file,
        album: req.body.album,
        id3Tags: req.body.id3Tags,
        dateReleased: req.body.dateReleased,
        dateCreated: req.body.dateCreated,
    });
    newTrack.save(function(error, saved) {
        if (error || (!saved)) {
            return res.sendStatus(404);
        }
        res.status(201);
        res.json(saved);
    });
});

//PUT /<modelname>/:id
// Replace the model instance identified by id with the
// HTTP request payload (JSON). If the there's not a model with id create a new one.
router.put('/:id', function(req, res) {
    if ((!req.body.name) || (!req.body.artist) || (!req.body.duration) || (!req.body.file)) {
        return res.sendStatus(400);
    }

    const id = req.params.id;

    Track.findById({"_id" : id}, function(err, found) {
        if (err) {
            return res.sendStatus(404);
        }
        if (!found) {
          let newTrack = new Track({
            name: req.body.name,
            artist: req.body.artist,
            duration: req.body.duration,
            file: req.body.file,
            album: req.body.album,
            id3Tags: req.body.id3Tags,
            dateReleased: req.body.dateReleased,
            dateCreated: req.body.dateCreated,
          });

            const ObjectId = mongoose.Types.ObjectId;
            newTrack._id = new ObjectId(req.params.id);

            newTrack.save(function(error, saved) {
                if (error || (!saved)) {
                    return res.sendStatus(404);
                }
                res.status(200);
                res.json(saved);
            });
        } else {
            Track.update({"_id" : id}, req.body, function(err, nEffected) {
              if(err || (nEffected == 0)){
                return res.sendStatus(400);
              }
              res.sendStatus(204);
            });
        }
    });
});

module.exports = router;
