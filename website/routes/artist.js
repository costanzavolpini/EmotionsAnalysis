//Costanza Volpini
/** @module routes/abook */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Artist = mongoose.model('Artist');



//GET /<modelname>
//lists all instances of the model
router.get('/', function(req, res) {
    Artist.find({}, function(err, found) {
        if (err || (!found)) {
            return res.sendStatus(404);
        }
        res.status(200);
        res.json(found);
    });
});


//GET /<modelname>/:id
//lists the model instance that matches the id
router.get('/:id', function(req, res) {
    Artist.findById({"_id" : req.params.id}, function(err, found) { // found corresponds to a single element (id)
        if (err || (!found)) {
            return res.sendStatus(404);
        }
        res.status(200);
        res.json(found);
    });
});


//DELETE /<modelname>/:id
//delete the model instance that matches the id
router.delete('/:id', function(req, res) {
    Artist.findById({"_id" : req.params.id}, function(err, found) {
        if (err || (!found)) {
            return res.sendStatus(404);
        }
        found.remove(function(err) {
            res.sendStatus(204);
        });
    });
});

//POST /<modelname>
//create a new model Instance and sends it as the response of the request
router.post('/', function(req, res) {
    if (!req.body.name) {
        return res.sendStatus(400);
    }
    const newArt = new Artist({
        name: req.body.name,
        genre: req.body.genre,
        artwork: req.body.artwork,
        dateCreated: req.body.dateCreated,
    });
    newArt.save(function(error, saved) {
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
    if ((!req.params.id) || (!req.body.name)) {
        return res.sendStatus(400);
    }

    Artist.findById({"_id" : req.params.id}, function(err, found) {
        if (err) {
            return res.sendStatus(400);
        }
        if (!found) {
            let newArt = new Artist(req.body);

            const ObjectId = mongoose.Types.ObjectId;
            newArt._id = new ObjectId(req.params.id);

            newArt.save(function(error, saved) {
                if (error || (!saved)) {
                    return res.sendStatus(400);
                }
                res.status(201);
                res.json(saved);
            });
        } else {
            Artist.update({"_id" : req.params.id}, req.body, function(err, nEffected) {
              if(err || (nEffected === 0)){
                return res.sendStatus(400);
              }
              res.sendStatus(204);
            });
        }
    });
});

module.exports = router;
