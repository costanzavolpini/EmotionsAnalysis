//Costanza Volpini
/** @module routes/abook */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/User')
const User = mongoose.model('User');

//GET /<modelname>
//lists all instances of the model
router.get('/', function(req, res) {
    User.find({}, {password: 0}, function(err, found) {
        if (err || !(found)) {
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
    User.findById({"_id" : id}, function(err, found) {
        if (err || !(found)) {
            return res.sendStatus(404);
        }
        userFound = found.toObject();
        delete userFound.password;
        res.status(200);
        res.json(userFound);
    });
});

//DELETE /<modelname>/:id
//delete the model instance that matches the id
router.delete('/:id', function(req, res) {
    let id = req.params.id;
    User.findById({"_id" : id}, function(err, found) {
        if (err || !(found)) {
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
    if ((!req.body.userName) || (!req.body.email) || (!req.body.password)) {
        return res.status(400).json({});
    }
    const newUser = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateCreated: req.body.dateCreated,
        playlists: req.body.playlists,
    });
    newUser.save(function(error, saved) {
        if (error || (!saved)) {
            return res.sendStatus(404);
        }
        userSaved = saved.toObject();
        delete userSaved.password;
        res.status(201);
        res.json(userSaved);
    });
});



//PUT /<modelname>/:id
// Replace the model instance identified by id with the
// HTTP request payload (JSON). If the there's not a model with id create a new one.
router.put('/:id', function(req, res) {
    if ((!req.body.userName) || (!req.body.email) || (!req.body.password)) {
        return res.sendStatus(400);
    }

    const id = req.params.id;

    User.findById({"_id" : id}, function(err, found) {
        if (err) {
            return res.sendStatus(404);
        }
        if (!found) {
          let newUser = new User({
              userName: req.body.userName,
              email: req.body.email,
              password: req.body.password,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              dateCreated: req.body.dateCreated,
              playlists: req.body.playlists,
          });

            const ObjectId = mongoose.Types.ObjectId;
            newUser._id = new ObjectId(req.params.id);

            newUser.save(function(error, saved) {
                if (error || (!saved)) {
                    return res.sendStatus(404);
                }
                userSaved = saved.toObject();
        				delete userSaved.password;
                res.status(201);
                res.json(userSaved);
            });
        } else {
            User.update({"_id" : id}, req.body, function(err, nEffected) {
              if(err || (nEffected == 0)){
                return res.sendStatus(400);
              }
              res.sendStatus(204);
            });
        }
    });
});

module.exports = router;
