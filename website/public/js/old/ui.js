//Accepts the list of tracks returned from the server and renders it
function renderTracks(tracks) {

    currentTracks = tracks;

    const tracksData = buildTracksData(tracks);

    const data = {
        "tracks": tracksData
    };

    dust.render("tracks", data, function(err, out) {

        const content = document.getElementById("content");

        content.innerHTML = out;

        bindAlbumLink();

        bindArtistLink();

        bindTracksDelete();

        bindEditTrackName();

        setupPlayer();

        //add one event listener for all tracks using event delegation
        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('fl-tl-file-link')) {
                // prevent anchor element from following link
                event.preventDefault();

                playTrackById(event.target.dataset.tid)
            }
        })

    });

}

//Structures the data as expected by the views
function buildTracksData(tracks) {

    const tracksData = [];

    for (track in tracks) {

        const newTracksData = {};
        newTracksData.artist = {};
        newTracksData.album = {};

        newTracksData.name = tracks[track].name;
        newTracksData._id = tracks[track]._id;
        newTracksData.duration = formatTime(tracks[track].duration);

        newTracksData.artist._id = tracks[track].artist._id;
        newTracksData.artist.name = tracks[track].artist.name;

        newTracksData.album._id = tracks[track].album._id;
        newTracksData.album.name = tracks[track].album.name;

        tracksData.push(newTracksData);

    }

    return tracksData;

}

function renderArtists(artists) {
    //create the data object with the structure expected by the compiled view
    const data = {
        "artists": artists
    }

    dust.render("artists", data, function(err, out) {

        const content = document.getElementById("content");

        content.innerHTML = out;

        bindArtistLink();

        bindArtistDelete();

    });

    //console.log(artists);
}




function renderAlbums(albums) {

    const albumData = [];

    for (album in albums) {

        const newAlbumData = {};
        newAlbumData.artist = {};

        newAlbumData.artwork = albums[album].artwork;
        newAlbumData._id = albums[album]._id;
        newAlbumData.name = albums[album].name;
        newAlbumData.artist._id = albums[album].artist._id;
        newAlbumData.artist.name = albums[album].artist.name;

        albumData.push(newAlbumData);

    }

    const data = {
        "albums": albumData
    };

    dust.render("albums", data, function(err, out) {

        const content = document.getElementById("content");

        content.innerHTML = out;

        bindAlbumLink();

        bindAlbumDelete();

        bindArtistLink();

        favouriteAlbumBind();


    });

}




//NOTE: Still used by setupSearch
function createHTMLLibrary(tracks) {
    let newHtml = "";
    tracks.forEach(function(track) {
        const artist = findOne(model.artists, "_id", track.artist);
        const album = findOne(model.albums, "_id", track.album);

        newHtml += '<div id="' + track._id + '"" class="fl-tl-row" draggable="true" ondragstart="drag(event)">';
        newHtml += '<div class="fl-tl-cell fl-tl-name"><a href="#">' + track.name + '</a></div>\n';
        newHtml += '<div class="fl-tl-cell fl-tl-artist"><a href="artists/' + encodeURI(artist.name) + '">' + artist.name + '</a></div>\n';
        newHtml += '<div class="fl-tl-cell fl-tl-album"><a href="albums/' + encodeURI(album.name) + '">' + album.name + '</a></div>\n';
        newHtml += '<div class="fl-tl-cell">' + track.count + '</a></div>\n';
        newHtml += '<div class="fl-tl-cell fl-tl-time">' + formatTime(track.duration) + '</div>\n';
        newHtml += '</div>\n';
    })

    return newHtml;
}

/* Search */

function setupSearch() {
    const searchBox = document.getElementById("main-search");
    searchBox.addEventListener("input", function() {
        const split = this.value.split(" ");

        result = fuzzyFind(model.tracks, "name", this.value);

        if (this.value.trim() === "") {
            drawLibrary();
            return;
        }


        const container = document.getElementById('tracks-list');
        const classList = container.classList;

        let newHtml = '<div class="fl-tl-thead fl-tl-row">\n\
    <div class="fl-tl-th fl-tl-name">Song</div>\n\
    <div class="fl-tl-th fl-tl-artist">Artist</div>\n\
    <div class="fl-tl-th fl-tl-album">Album</div>\n\
    <div class="fl-tl-th fl-tl-time">Time</div>\n\
    </div>';

        newHtml += createHTMLLibrary(result);

        container.innerHTML = newHtml;
    })
}

function find(arr, prop, val) {
    const res = [];
    arr.forEach(function(item) {
        if ("undefined" !== item[prop] &&
            item[prop] === val) {
            res.push(item)
        }
    });
    return res;
}

function findOne(arr, prop, val) {
    for (let i = 0, l = arr.length; i < l; i++) {
        const item = arr[i];
        if ("undefined" !== item[prop] &&
            item[prop] === val) {
            return item;
        }
    }
}

function findFirstAlbumInCollection(model, prop, array) {
    for (let key in array) {
        for (let i = 0, l = model.length; i < l; i++) {
            const item = model[i];
            if ("undefined" !== item[prop] &&
                item[prop] === array[key]) {
                return item;
            }
        }
    }

    return undefined
}

/* Search */

/* Playlist: Not working after the switch to AJAX */
function setupPlaylists() {
    loadPlaylistsFromLocalStorage();

    const createPlBtn = document.getElementById("create-pl-btn");
    createPlBtn.addEventListener('click', function() {

        localStorage.pl_cnt = localStorage.pl_cnt || 0;
        const cnt = localStorage.pl_cnt;
        const _id = "pl-" + cnt
        const name = 'New Playlist ' + (++cnt);
        const newPlaylist = playlist(_id, name, model.users[0]._id, []);

        //update localStorage counter
        localStorage.pl_cnt = cnt;

        //persist to localStorage
        savePlaylist(newPlaylist);
        appendNewPlaylistToMenu(newPlaylist);
    })

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-btn')) {
            return onEditPlaylistClicked(e.target)
        }

        if (e.target.classList.contains('pl-name-input')) {
            return e.preventDefault();
        }

        if (e.target.classList.contains('pl-name')) {
            e.preventDefault();
            return onPlaylistClicked(e.target)
        }

        //the click was outside an edit element, close currently edited ones
        const currentlyEditing = document.querySelectorAll('#playlists > li.edit .edit-btn');
        for (let i = currentlyEditing.length - 1; i >= 0; i--) {
            onEditPlaylistClicked(currentlyEditing[i]);
        };

    });
}

function allowDrop(evt) {
    evt.preventDefault();
}

function drag(evt) {
    evt.dataTransfer.setData("text/plain", evt.currentTarget.id);
}

function drop(evt) {
    evt.preventDefault();
    const trackId = evt.dataTransfer.getData("text/plain");
    const playlistId = evt.currentTarget.id
    addTrackToPlaylist(playlistId, trackId)
}

function addTrackToPlaylist(playlistId, trackId) {
    const playlists = JSON.parse(localStorage.playlists);
    const pl = playlists[playlistId];
    if (typeof pl === "undefined") {
        throw new Error("playlist doesn't exist in localStorage")
    }

    const track = findOne(model.tracks, "_id", trackId);
    if (typeof track === "undefined" || track === null) {
        throw new Error("track doesn't exist in the model")
    }

    pl.tracks.push(trackId);

    //persist
    playlists[playlistId] = pl;
    localStorage.playlists = JSON.stringify(playlists);
}

function onPlaylistClicked(link) {
    localStorage.playlists = localStorage.playlists || JSON.stringify({});
    const playlists = JSON.parse(localStorage.playlists);
    const id = link.dataset["for"];
    const playlist = playlists[id];
    const tracks = playlist.tracks;
    const container = document.getElementById('tracks-list');
    const classList = container.classList;

    if (tracks.length < 1) {
        return container.innerHTML = "Playlist " + playlist.name + " is empty."
    }

    let newHtml = '<div class="fl-tl-thead fl-tl-row">\n\
  <div class="fl-tl-th fl-tl-name">Song</div>\n\
  <div class="fl-tl-th fl-tl-artist">Artist</div>\n\
  <div class="fl-tl-th fl-tl-album">Album</div>\n\
  <div class="fl-tl-th fl-tl-time">Time</div>\n\
  </div>';

    tracks.forEach(function(track) {
        track = findOne(model.tracks, "_id", track)
        const artist = findOne(model.artists, "_id", track.artist);
        const album = findOne(model.albums, "_id", track.album);

        newHtml += '<div id="' + track._id + '"" class="fl-tl-row" draggable="true">'
        newHtml += '<div class="fl-tl-cell fl-tl-name"><a href="#">' + track.name + '</a></div>\n';
        newHtml += '<div class="fl-tl-cell fl-tl-artist"><a href="artists/' + encodeURI(artist.name) + '">' + artist.name + '</a></div>\n';
        newHtml += '<div class="fl-tl-cell fl-tl-album"><a href="albums/' + encodeURI(album.name) + '">' + album.name + '</a></div>\n';
        newHtml += '<div class="fl-tl-cell fl-tl-time">' + formatTime(track.duration) + '</div>\n';
        newHtml += '</div>\n';
    })

    container.innerHTML = newHtml;
}

function onEditPlaylistClicked(btn) {
    const id = btn.dataset["for"];
    const el = document.getElementById(id);
    const input = document.querySelector('#' + id + " > input[type='text']");

    if (el.classList.contains("edit")) {
        el.classList.remove('edit')
        btn.innerHTML = '<i class="fa fa-pencil" ></i>'
        const input = document.querySelector('#' + id + " > input[type='text']");
        const nameLink = document.querySelector('#' + id + " > .pl-name");

        //return on empty string
        if (input.value.trim() == '') return;

        nameLink.innerHTML = '<i class="nav-menu-icon fa fa-bars"></i> ' + input.value;
        nameLink.href = "playlists/" + encodeURI(input.value)

        //persist change
        const playlists = JSON.parse(localStorage.playlists);
        playlists[id]["name"] = input.value;
        localStorage.playlists = JSON.stringify(playlists);
    } else {
        el.classList.add('edit')
        btn.innerHTML = '<i class="fa fa-check" ></i>'
        input.focus();
    }
}

function loadPlaylistsFromLocalStorage() {
    localStorage.playlists = localStorage.playlists || JSON.stringify({});
    const playlists = JSON.parse(localStorage.playlists);
    //merge localStorage playlists with model playlists
    /*
    model.playlists.forEach(function(playlist){
      if (!playlists.hasOwnProperty(playlist._id))
        playlists[playlist._id] = playlist;
    });
    */

    const keys = Object.keys(playlists);
    let newHtml = '';
    keys.forEach(function(key) {
        appendNewPlaylistToMenu(playlists[key]);
    });

    //persist playlists
    localStorage.playlists = JSON.stringify(playlists);
}

function appendNewPlaylistToMenu(pl) {
    const id = pl._id;
    const name = pl.name;
    let newHtml = '';
    newHtml += '  <li id="' + id + '" ondrop="drop(event)" ondragover="allowDrop(event)">';
    newHtml += '    <a class="pl-name" data-for="' + id + '" href="playlists/' + encodeURI(name) + '">';
    newHtml += '      <i class="nav-menu-icon fa fa-bars"></i>' + name;
    newHtml += '    </a>';
    newHtml += '    <a class="edit-btn" data-for="' + id + '" href="#"><i class="fa fa-pencil"></i></a>';
    newHtml += '    <input  class="pl-name-input" name="' + id + '" type="text" value="' + name + '">';
    newHtml += '  </li>';

    document.getElementById('playlists').innerHTML += newHtml;
}
/* Playlist: Not working after the switch to AJAX */

/* Player */

/**
 * This function setups the player. More specifically:
 * - It should create an audio element and append it in the body
 *
 * - The audio element should load by default the first track of your library
 *
 * - When the track is paused and you click on the play button of exercise one,
 *   it should play the current track and switch the icon of the button to 'pause'.
 *   You don't need to use the checkbox hack for toggling the icons. You might as well
 *   use Javascript.
 *
 * - When the track is playing and you click on the pause button of exercise one,
 *   it should pause the current track and switch the icon of the button to 'pause'.
 *
 *
 * Optionally:
 * - When the track is playing the progress bar should be updated to reflect the progress
 *
 * - When the progress bar is clicked the current time of the player should skip to
 *  the corresponding time (that is, if the click was on the 2/3 of the total width
 *  of the bar, the track current time should be the 2/3 of the total duration). Also
 *  the progress bar should be updated.
 *
 * - As the track is playing the elapsed time should be updated
 *
 * - Implement a volume bar that does what the progress bar does for sound but for volume.
 *
 * - When a track is clicked from the library, your player should start playing it
 *
 * - When a track finishes your player should play the next one
 */

function setupPlayer() {
  let flag = true;
    // Buttons
    const playButton = document.getElementById("play-pause");
    const muteButton = document.getElementById("mute");
    const fullScreenButton = document.getElementById("full-screen");
    const volumeOff = document.getElementById("volume-off");
    const volumeUp = document.getElementById("volume-up");
    const nextButton = document.getElementById("next");
    const previousButton = document.getElementById("previous");

    // Sliders
    const seekRail = document.getElementById("pl-timeline-rail");
    const seekBar = document.getElementById("pl-timeline-bar");
    const volumeRail = document.getElementById("pl-volume-rail");
    const volumeBar = document.getElementById("pl-volume-bar");

    //Labels
    const timeElapsed = document.getElementById("time-elapsed");
    const timeTotal = document.getElementById("time-total");

    // Audio element
    audio = document.createElement('audio');


    // every time the metadata are loaded for a track update the progress bar
    audio.addEventListener("loadedmetadata", function() {
        //set total time
        timeTotal.innerHTML = formatTime(Math.floor(audio.duration));

        //set volume
        volumeBar.style.width = (audio.volume * 100) + "%";
    });

    document.body.appendChild(audio);

    playTrackById(currentTracks[0]._id);

    // Event listener for the play/pause button
    playButton.addEventListener("click", function() {
        if (audio.paused == true) {
            play()
        } else {
            pause()
        }
    });

    // Event listeners for the previous/next buttons
    nextButton.addEventListener("click", function() {
        if (!currentPlayingTrack) return;
        const currentIdx = currentTracks.indexOf(currentPlayingTrack);

        if (currentIdx == -1) {
            return console.log("invalid currentTrack");
        }

        const nextIdx = (++currentIdx < currentTracks.length) ? currentIdx : 0
        playTrackById(currentTracks[nextIdx]._id);
    });

    previousButton.addEventListener("click", function() {
        if (!currentPlayingTrack) return;
        const currentIdx = currentTracks.indexOf(currentPlayingTrack);

        if (currentIdx == -1) {
            return console.log("invalid currentTrack");
        }

        const prevIdx = (--currentIdx > 0) ? currentIdx : (currentTracks.length - 1)
        playTrackById(currentTracks[prevIdx]._id);
    });

    // Event listener for the seek bar
    seekRail.addEventListener("click", function(evt) {
        const frac = (evt.offsetX / seekRail.offsetWidth)
        seekBar.style.width = (frac * 100) + "%";

        // Calculate the new time
        const time = audio.duration * frac;
        audio.currentTime = time;
    });

    // Update the seek bar as the track plays
    audio.addEventListener("timeupdate", function() {
        // Calculate the slider value
        const value = (100 / audio.duration) * audio.currentTime;

      //  currentPlayingTrack.count = 0;
        // Update the seek bar
        seekBar.style.width = value + "%";

        if((value > 0) && (value < 50)){
          currentPlayingTrack.count += 0;
        //  doJSONRequest('PUT', '/tracks/' + currentPlayingTrack._id, null, currentPlayingTrack, function(){});
        }else if((value >= 50) && (value < 100)){
          if(flag){
            flag = false;
            currentPlayingTrack.count += 50;
          //  doJSONRequest('PUT', '/tracks/' + currentPlayingTrack._id, null, currentPlayingTrack, function(){});
          }
        }else if(value == 100){
          currentPlayingTrack.count += 50;
        //   doJSONRequest('PUT', '/tracks/' + currentPlayingTrack._id, null, currentPlayingTrack, function(){});
        }


        // Update the elapsed time
        timeElapsed.innerHTML = formatTime(Math.floor(audio.currentTime));
    });

    // Event listener for the volume bar
    volumeRail.addEventListener("click", function(evt) {
        const frac = (evt.offsetX / volumeRail.offsetWidth)
        volumeBar.style.width = (frac * 100) + "%";

        audio.volume = frac;
    });

    //Click listener for volume buttons
    volumeOff.addEventListener("click", function(evt) {
        volumeBar.style.width = "0%";
        audio.volume = 0;

        volumeOff.classList.add("active");
        volumeUp.classList.remove("active");
    });

    volumeUp.addEventListener("click", function(evt) {
        volumeBar.style.width = "100%";
        audio.volume = 1;

        volumeUp.classList.add("active");
        volumeOff.classList.remove("active");
    });
}

function play(isSocket) {
  if(!isSocket){
    playTrackSocket(currentPlayingTrack._id) //1
  }
    // Play the track
    audio.play();

    // Update the button icon to 'Pause'
    const playButton = document.getElementById("play-pause");
    playButton.classList.remove('fa-play');
    playButton.classList.add('fa-pause');
}

function pause() {
    // Pause the track
    audio.pause();

    // Update the button icon to 'Play'
    const playButton = document.getElementById("play-pause");
    playButton.classList.remove('fa-pause');
    playButton.classList.add('fa-play');
}

function playTrackById(trackId) {
    const track = findOne(currentTracks, "_id", trackId);

    if (!track) return console.log("playTrackById(): Track not found!")

    currentPlayingTrack = track;

    const artist = findOne(currentArtists, "_id", track.artist._id);
    const album = findOne(currentAlbums, "_id", track.album._id);

    const plTrackArtist = document.querySelector('.pl-track-artist');
    plTrackArtist.href = 'artists/' + artist.name;
    plTrackArtist.innerHTML = artist.name

    const plTrackTitle = document.querySelector('.pl-track-title');
    plTrackTitle.href = 'albums/' + album.name;
    plTrackTitle.innerHTML = currentPlayingTrack.name;

    const moImage = document.querySelector('.pl-artwork .mo-image');
    moImage.style.backgroundImage = "url(" + album.artwork + ")"

    audio.src = track.file;
    pause();
}
