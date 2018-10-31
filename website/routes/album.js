//Costanza Volpini
/** @module routes/abook */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Album = mongoose.model('Album');

//GET /<modelname>
//lists all instances of the model
router.get('/', function(req, res) {
    Album.find({}, function(err, found) {
        if (err || (!found)) {
            return res.sendStatus(404);
        }
        res.json(found);
    });
});

//GET /<modelname>/:id
//lists the model instance that matches the id
router.get('/:id', function(req, res) {
    let id = req.params.id;
    Album.findById({"_id" : id}, function(err, found) {
        if (err || (!found)) {
            return res.sendStatus(404);
        }
        res.json(found);
    });
});

//DELETE /<modelname>/:id
//delete the model instance that matches the id
router.delete('/:id', function(req, res) {
    let id = req.params.id;
    Album.findById({"_id" : id}, function(err, found) {
        if (err || (!found)) {
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
    if ((!req.body.name) || (!req.body.artist)) {
        return res.sendStatus(400);
    }
    const newAlb = new Album({
        name: req.body.name,
        artist: req.body.artist,
        artwork: req.body.artwork,
        tracks : req.body.tracks,
        dateCreated: req.body.dateCreated,
        dateReleased: req.body.dateReleased,
        label: req.body.label,
    });
    newAlb.save(function(error, saved) {
        if (error || (!saved)) {
            return res.sendStatus(400);
        }
        res.status(201);
        res.json(saved);
    });
});

//PUT /<modelname>/:id
// Replace the model instance identified by id with the
// HTTP request payload (JSON). If the there's not a model with id create a new one.
router.put('/:id', function(req, res) {
    if ((!req.params.id) || (!req.body.name) || (!req.body.artist)) {
        return res.sendStatus(400);
    }

    const id = req.params.id;

    Album.findById({"_id" : id}, function(err, found) {
        if (err) {
            return res.sendStatus(400);
        }
        if (!found) {
          let newAlb = new Album({
              name: req.body.name,
              artist: req.body.artist,
              artwork: req.body.artwork,
              tracks : req.body.tracks,
              dateCreated: req.body.dateCreated,
              dateReleased: req.body.dateReleased,
              label: req.body.label,
          });

            const ObjectId = mongoose.Types.ObjectId;
            newAlb._id = new ObjectId(req.params.id);

            newAlb.save(function(error, saved) {
                if (error || (!saved)) {
                    return res.sendStatus(404);
                }
                res.status(201);
                res.json(saved);
            });
        } else {
            Album.update({"_id" : id}, req.body, function(err, nEffected) {
              if(err || (nEffected === 0)){
                return res.sendStatus(400);
              }
              res.sendStatus(204);
            });
        }
    });
});

module.exports = router;
