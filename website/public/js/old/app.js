/* Setup on Page Load */
let currentTracks;
let currentArtists;
let currentAlbums;

window.onload = function() {

    bindMenu();

    updatePage();

    filterFavouriteBind();

    //Not implemented in the AJAX version
    //setupPlaylists();

    setupSearch();

}

//Binds the calls to the function to draw the library, artists, albums to the menu
function bindMenu() {

    //removeIf(skeleton)
    const menu = document.querySelectorAll("#main-menu > li > a");

    for (let elem = 0; elem < menu.length; ++elem) {
        //console.log(menu[elem])
        if (menu[elem].getAttribute("href").indexOf("library.html") > -1) {
            menu[elem].onclick = function(e) {
                drawLibrary(e);
                setupPlayer();
            }
        } else if (menu[elem].getAttribute("href").indexOf("artists.html") > -1)
            menu[elem].onclick = drawArtists;
        else if (menu[elem].getAttribute("href").indexOf("albums.html") > -1)
            menu[elem].onclick = drawAlbums;
    }
    //endRemoveIf(skeleton)
}

/* UI */

/* Library */

//Draws the library
//The function to call in order to render the tracks is renderTracks, defined in ui.js
function drawLibrary(e, addHistory) {

    //removeIf(skeleton)
    if (e && e.target) {
        e.preventDefault();
    }

    addLibraryToHistory(addHistory);

doJSONRequest("GET", "/albums", null, null, function(albums) {
  currentAlbums = albums;
      doJSONRequest("GET", "/artists", null, null, function(artists) {
          currentArtists = artists;
          //execute the AJAX call to the get tracks
          doJSONRequest("GET", "/tracks", null, null, renderTracks);
      });
    });
    //endRemoveIf(skeleton)
}

//removeIf(skeleton)
function addLibraryToHistory(addHistory) {
    if ((("undefined" == typeof addHistory) ||
            (addHistory === null)) ||
        addHistory == true) {

        const state = {
            'function': 'drawLibrary'
        };

        addToHistory(JSON.stringify(state), "/#library");
    }
}
//endRemoveIf(skeleton)

//Binds the deleteTrack function to the track elements
function bindTracksDelete() {
    //removeIf(skeleton)
    const tracks = document.querySelectorAll(".fl-tl-delete a");

    for (let elem = 0; elem < tracks.length; ++elem) {
        tracks[elem].onclick = deleteTrack;
    }
    //endRemoveIf(skeleton)
}

//Deletes a track
//The function to update the UI is removeTrack, defined in the scope of the function
function deleteTrack(e) {

    //removeIf(skeleton)
    let href;
    const target = e.target;

    if (e && e.target) {
        e.preventDefault();
        href = target.getAttribute("href");
    }

    //execute the AJAX call to the delete a single album
    doJSONRequest("DELETE", href, null, null, removeTrack);
    //endRemoveIf(skeleton)

    //Removes a track from the UI
    function removeTrack() {

        const toDelete = target.parentNode.parentNode;
        const parent = document.getElementById("tracks-list");

        parent.removeChild(toDelete);

    }
}

//removeIf(skeleton)
function bindEditTrackName() {

    const tracksName = document.querySelectorAll("#tracks-list > div > div.fl-tl-name > span + .edit-btn");

    for (let elem = 0; elem < tracksName.length; ++elem) {
        tracksName[elem].onclick = editTrackName;
    }

}

function editTrackName(e) {

    if (e && e.target) {
        e.preventDefault();
    }

    const target = e.target;

    //console.log(target);

    const editable = target.previousSibling;

    //console.log(editable.contentEditable);
    //console.log(editable.contentEditable ==  "false");

    if (editable.contentEditable == "false" || editable.contentEditable == "inherit") { //we have to enable the editing

        editable.contentEditable = "true";

        removeClass(target.firstChild, "fa-pencil");

        removeClass(target.firstChild, "fl-tl-pencil");

        addClass(target.firstChild, "fa-check");

        addClass(target.firstChild, "fl-tl-check");

        //set the cursor on the editable element
        const s = window.getSelection(),
            r = document.createRange();
        r.setStart(editable, 0);
        r.setEnd(editable, 0);
        s.removeAllRanges();
        s.addRange(r);

    } else { //we have to save the modified name

        const href = editable.getAttribute("href");

        //send the data to the server
        const newName = editable.innerText;

        const updatedTrack = {
            'name': newName
        }

        doJSONRequest("PUT", href, null, updatedTrack, disableEditing);

        function disableEditing() {

            editable.contentEditable = "false";

            removeClass(target.firstChild, "fa-check");

            removeClass(target.firstChild, "fl-tl-check");

            addClass(target.firstChild, "fa-pencil");

            addClass(target.firstChild, "fl-tl-pencil");

        }

    }

}
//endRemoveIf(skeleton)

/* Library */

/* Artists */
//Draws the artists
//The function to call in order to render the artists is renderArtists, defined in ui.js
function drawArtists(e, addHistory) {

    //removeIf(skeleton)
    if (e && e.target) {
        e.preventDefault();
    }

    addArtistsToHistory(addHistory);

    //execute the AJAX call to get the artists
    doJSONRequest("GET", "/artists", null, null, renderArtists);
    //endRemoveIf(skeleton)

}

//removeIf(skeleton)
function addArtistsToHistory(addHistory) {
    if ((("undefined" == typeof addHistory) ||
            (addHistory === null)) ||
        addHistory == true) {
        const state = {
            'function': 'drawArtists'
        };

        addToHistory(JSON.stringify(state), "/#artists");
    }
}
//endRemoveIf(skeleton)

//Draws a single artist
//The function to call in order to render the artist is renderShowArtist, defined in the scope of the function
function drawArtist(e, addHistory) {

    //removeIf(skeleton)
    let href;

    if (e && e.target) {
        e.preventDefault();
        href = e.target.getAttribute("href");
    } else {
        href = e;
    }

    addArtistToHistory(href, addHistory)

    //execute the AJAX call to the get a single artist
    doJSONRequest("GET", href, null, null, renderArtist);

    function renderArtist(artist) {

        //we need the artist's tracks
        doJSONRequest("GET", "/tracks?filter=" + encodeURIComponent(JSON.stringify({
            'artist': artist._id
        })), null, null, renderShowArtist);
        //endRemoveIf(skeleton)

        function renderShowArtist(tracks) {

            const artistData = [];
            const artistTracks = buildTracksData(tracks);

            artistData.artwork = artist.artwork;
            artistData._id = artist._id;
            artistData.name = artist.name;
            artistData.genre = artist.genre;

            const data = {
                "artist": artistData,
                "tracks": artistTracks
            };

            dust.render("artist", data, function(err, out) {

                const content = document.getElementById("content");

                content.innerHTML = out;

                bindArtistLink();

                bindAlbumLink();

                bindTracksDelete();

                //removeIf(skeleton)
                bindEditTrackName();
                //endRemoveIf(skeleton)


            });
        }
    //removeIf(skeleton)
    }
    //endRemoveIf(skeleton)
}

//removeIf(skeleton)
function addArtistToHistory(href, addHistory) {
    if ((("undefined" == typeof addHistory) ||
            (addHistory === null)) ||
        addHistory == true) {
        const state = {
            'function': 'drawArtist',
            'href': href
        };

        addToHistory(JSON.stringify(state), "/#" + href);
    }
}
//endRemoveIf(skeleton)

function bindArtistLink() {
    const artists = document.querySelectorAll(".artist-link");

    for (let elem = 0; elem < artists.length; ++elem) {
        //console.log(artists[elem])
        artists[elem].onclick = drawArtist;
    }
}

function bindArtistDelete() {
    const artists = document.querySelectorAll(".delete-btn");

    for (let elem = 0; elem < artists.length; ++elem) {
        //console.log(albums[elem])
        artists[elem].onclick = deleteArtist;
    }
}

//Deletes an artists
//The function to update the UI is removeArtist, defined in the scope of the function
function deleteArtist(e) {

    //removeIf(skeleton)
    let href;
    const target = e.target;

    if (e && e.target) {
        e.preventDefault();
        href = target.getAttribute("href");
    }

    //execute the AJAX call to the delete a single album
    doJSONRequest("DELETE", href, null, null, removeArtist);
    //endRemoveIf(skeleton)

    function removeArtist() {

        //console.log(responseText);

        //console.log(target);

        const toDelete = target.parentNode.parentNode;
        const parent = document.getElementById("artists-list");

        parent.removeChild(toDelete);

    }
}

/* Artists */

/* Albums */
//Draws the albums
//The function to call in order to render the albums is renderAlbums, defined in ui.js
function drawAlbums(e, addHistory) {

    //removeIf(skeleton)
    if (e && e.target)
        e.preventDefault();

    addAlbumsToHistory(addHistory);

    //execute the AJAX call to the get albums
    doJSONRequest("GET", "/albums", null, null, function(albums) {
        currentAlbums = albums;
        renderAlbums(currentAlbums);
      });
    //endRemoveIf(skeleton)
}

//removeIf(skeleton)
function addAlbumsToHistory(addHistory) {
    if ((("undefined" == typeof addHistory) ||
            (addHistory === null)) ||
        addHistory == true) {
        const state = {
            'function': 'drawAlbums'
        };

        addToHistory(JSON.stringify(state), "/#albums");
    }
}
//endRemoveIf(skeleton)

//Draws a single album
//The function to call in order to render the album is renderShowAlbum, defined in the scope of the function
function drawAlbum(e, addHistory) {

    //removeIf(skeleton)
    let href;

    if (e && e.target) {
        e.preventDefault();
        href = e.target.getAttribute("href");
    } else {
        href = e;
    }

    addAlbumToHistory(href, addHistory);

    //console.log(target.getAttribute("href"));

    //execute the AJAX call to the get a single album
    doJSONRequest("GET", href, null, null, renderAlbum);

    function renderAlbum(album) {

        //we need the album's tracks
        doJSONRequest("GET", "/tracks?filter=" + encodeURIComponent(JSON.stringify({
            'album': album._id
        })), null, null, renderShowAlbum);

        //endRemoveIf(skeleton)

        function renderShowAlbum(tracks) {

            const albumData = [];
            const albumTracks = buildTracksData(tracks);

            albumData.artist = {};

            albumData.artwork = album.artwork;
            albumData._id = album._id;
            albumData.name = album.name;
            albumData.label = album.label;
            albumData.dateReleased = album.dateReleased.split("T")[0];
            albumData.artist._id = album.artist._id;
            albumData.artist.name = album.artist.name;

            const data = {
                "album": albumData,
                "tracks": albumTracks
            };

            dust.render("album", data, function(err, out) {

                const content = document.getElementById("content");

                content.innerHTML = out;

                bindAlbumLink();

                bindArtistLink();

                bindTracksDelete();

                //removeIf(skeleton)
                bindEditTrackName();
                //endRemoveIf(skeleton)

            });

        }
    //removeIf(skeleton)
    }
    //endRemoveIf(skeleton)
}

//removeIf(skeleton)
function addAlbumToHistory(href, addHistory) {
    if ((("undefined" == typeof addHistory) ||
            (addHistory === null)) ||
        addHistory == true) {
        const state = {
            'function': 'drawAlbum',
            'href': href
        };

        addToHistory(JSON.stringify(state), "/#" + href);
    }
}
//endRemoveIf(skeleton)

function bindAlbumLink() {
    const albums = document.querySelectorAll(".album-link");

    for (let elem = 0; elem < albums.length; ++elem) {
        //console.log(albums[elem])
        albums[elem].onclick = drawAlbum;
    }
}

function bindAlbumDelete() {
    const albums = document.querySelectorAll(".delete-btn");

    for (let elem = 0; elem < albums.length; ++elem) {
        //console.log(albums[elem])
        albums[elem].onclick = deleteAlbum;
    }
}

//Deletes an album
//The function to update the UI is removeAlbum, defined in the scope of the function
function deleteAlbum(e) {

    //removeIf(skeleton)
    let href;
    const target = e.target;

    if (e && e.target) {
        e.preventDefault();
        href = target.getAttribute("href");
    }

    //execute the AJAX call to the delete a single album
    doJSONRequest("DELETE", href, null, null, removeAlbum);

    //endRemoveIf(skeleton)

    function removeAlbum() {

        const toDelete = target.parentNode.parentNode;
        const parent = document.getElementById("albums-list");

        parent.removeChild(toDelete);

    }

}

/* Albums */

/* UI */

/* History Navigation */

/*
 * The addToHistory function push the @param{state} and the @param{url} in the history State
 *
 * @param {JSON String} state The current state of the search form's button
 * @param {String} url The current url as long with the hash
 */
function addToHistory(state, url) {

    //removeIf(skeleton)

    history.pushState(state, null, url);

    //console.log("Added to history: " + url + ", state: " + state);

    //endRemoveIf(skeleton)

}

/*
 * The updatePage function handles the update of the page when an onpopstate or onload event is fired.
 * The function gets the hash and the current state, calls the ajaxFind function to update the view
 * and update the form's input value with the data retrieved from the hash
 *
 * @param {JSON String} state The current state of the search form's button
 * @param {String} url The current url as long with the hash
 */
function updatePage(event) {

    //removeIf(skeleton)

    //get reference to the hash and to the current state
    const hash = document.location.hash;
    let currentState;
    if (event && event.state)
        currentState = JSON.parse(event.state);

    if (currentState) {

        //console.log(hash);
        //console.log(currentState);

        if (currentState.function == 'drawLibrary')
            drawLibrary(null, false);
        else if (currentState.function == 'drawArtist')
            drawArtist(currentState.href, false);
        else if (currentState.function == 'drawAlbum')
            drawAlbum(currentState.href, false);
        else if (currentState.function == 'drawAlbums')
            drawAlbums(null, false);
        else if (currentState.function == 'drawArtists')
            drawArtists(null, false);

    } else if (hash) {

        //console.log(hash);
        //console.log(currentState);

        if (hash.indexOf("library") > -1)
            drawLibrary(null, false);
        else if (hash.indexOf("#artists/") > -1)
            drawArtist(hash.replace("#", ""), false);
        else if (hash.indexOf("#albums/") > -1)
            drawAlbum(hash.replace("#", ""), false);
        else if (hash.indexOf("albums") > -1)
            drawAlbums(null, false);
        else if (hash.indexOf("artists") > -1)
            drawArtists(null, false);

    } else {
        drawLibrary(null, false);
    }
    //endRemoveIf(skeleton)
}

function favouriteAlbumBind(){
  const checks = document.getElementsByName('checkbox-btn');
  for(check of checks){
    let idAlbum = check.parentNode.childNodes[3].childNodes[0].href.split('/').pop();
    for(alb of currentAlbums){
      if((alb._id == idAlbum) && (alb.favourite == true)){
        check.checked = true;
      }
    }
    check.addEventListener('change', favouriteAlbum);
  }
}


function favouriteAlbum(evt){
  const idAlbum = evt.target.parentNode.childNodes[3].childNodes[0].href.split('/').pop();
  let album;
  for(alb of currentAlbums){
    if(alb._id == idAlbum) {
      album = alb;
      if(album.favourite == true){
        album.favourite = false;
      }else{
        album.favourite = true;
      }
    }
  }
  doJSONRequest('PUT', '/albums/' + idAlbum, null, album, function(){})
}

function filterFavouriteBind(){
  const album = document.getElementsByClassName('nav-menu')[0].childNodes[3].childNodes[0];
  const filter = document.createElement('INPUT');
  filter.type = 'checkbox';
  filter.addEventListener('click', favouriteAlbum);
  album.appendChild(filter);

  function favouriteAlbum(evt){
    evt.stopImmediatePropagation(); //event.preventDefault() of parentNode
    let albumsfav;
    if(evt.target.checked){
      doJSONRequest("GET", "/albums/fav", null, null, function(albums) {
          albumsfav = albums;
          renderAlbums(albumsfav);
    });
  }else{
    doJSONRequest("GET", "/albums", null, null, function(albums) {
        renderAlbums(albums);
  });
  }
  }
}

//removeIf(skeleton)
//bind the window onpopstate event to the updatePage function
window.onpopstate = updatePage;
//endRemoveIf(skeleton)

/* History Navigation */
