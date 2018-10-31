//Costanza Volpini
/** @module routes/abook */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//root URL
//This is the entry point of your API. It lists all the resources and the URIs under which they are available.
router.get("/", function(req, res) {
	res.json([
    {
			"rel": "index",
			"href": "http://localhost:3000/index"
		},
    {
			"rel": "album",
			"href": "http://localhost:3000/albums"
		},
		{
			"rel": "playlist",
			"href": "http://localhost:3000/playlists"
		},
		{
			"rel": "track",
			"href": "http://localhost:3000/tracks"
		},
		{
			"rel": "user",
			"href": "http://localhost:3000/users"
		}
	]);
});


module.exports = router;
