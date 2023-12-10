document.addEventListener("DOMContentLoaded", function () {

    //variables to select the id or class of a specific button or markup of a page
    const searchPage = document.querySelector('.search-page');
    const songDisplayPage = document.querySelector('.song-display');
    const closeButton = document.querySelector('#close-view-button');
    const hideButton = document.querySelector('.hide-button');
    const playlistButton = document.querySelector('#playlist-button');
    const playlistPage = document.querySelector('.playlist-page');
    const hideplayListButton = document.querySelector('.hide-playlist-button');
    const songsListHeader = document.querySelector('.songs-list');
    const playListHeader = document.querySelector('.play-list');


    //functions to the hide and show a specific page 
    function showPage(elements, visible) {
        elements.forEach(element => {
            if (visible) {
                element.style.display = ''; 
                element.hidden = false;
            } else {
                element.style.display = 'none';
                element.hidden = true;
            }
        });
    }

    //when clicking on the close button, it will display back to the search/browse page.
    closeButton.addEventListener('click', function () {
        showPage([searchPage], true); 
        showPage([songDisplayPage, playlistPage], false); 
        showPage([hideButton], false); 
        showPage([hideplayListButton], true); 
    });
    
    //when clicking on a song in the search/browse page, it will show the single song page with the song specific. 
    songsListHeader.addEventListener('click', function (e) {
        if (e.target.tagName === 'SPAN') {
            showPage([searchPage, playlistPage], false); 
            showPage([songDisplayPage], true); 
            showPage([hideButton], true); 
            showPage([hideplayListButton], false); 
        }
    });
    
    //when clicking on playlist button, it will show the playlist page. 
    playlistButton.addEventListener('click', function () {
        showPage([searchPage, songDisplayPage], false); 
        showPage([playlistPage, hideButton], true); 
        showPage([hideplayListButton], false); 
    });

    /*When clicking on song on playlist, it should display the content. However I couldn't get it working*/
    playListHeader.addEventListener('click', function (e) {
        if (e.target.tagName === 'SPAN') {
            showPage([searchPage, playlistPage], false); 
            showPage([songDisplayPage], true); 
            showPage([hideButton], true); 
            showPage([hideplayListButton], false); 
        }
    });

    /*When moving mouse to credit button, it will display our names and GitHub link */
    const creditsButton = document.querySelector('#credit-button');
    const creditsPopup = document.querySelector('#credits-popup');
  
    creditsButton.addEventListener('mouseover', function () {
      creditsPopup.style.display = 'block';
  
      setTimeout(() => {
          creditsPopup.style.display = 'none';
      }, 5000); 
  });

    /*This is for disabling other radio button and its input/select when a radio button 
    is clicked and will change the opacity of a unclicked radio button and its input/select*/
    document.querySelectorAll('input[type=radio][name="chooseSong"]').forEach(function(radio) {
        radio.addEventListener('change', function() {
            document.querySelectorAll('.form-group').forEach(function(e) {
                if (!e.contains(radio)) {
                    e.style.opacity = '0.5';
                    let inputs = e.querySelectorAll('input, select');
                    inputs.forEach(input => {
                        input.disabled = true;
                    });
                } else {
                    e.style.opacity = '1';
                    let inputs = e.querySelectorAll('input, select');
                    inputs.forEach(input => {
                        input.disabled = false;
                    });
                }
            });
        });
    });

    /* api and json files */	
    const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';
    const artist = JSON.parse(content1);
    const genres = JSON.parse(content2);


    //for the option values from the artist and genres json files. 
    selectOptions('#artist-select', artist);
    selectOptions('#genre-select', genres);


    /* This function is used to fetch the songs and recieved the song content, otherwise display an error. 
    it will get the information for sorting and displaying the songs. When user clicks on the sorting arrow, 
    it will get the information for the song that is sorted from A-Z or descendant of numbers. Storing the songs on a songsKey in the localStorage */
    let songsList = [];
    const songKey = 'songsKey';

    function fetchSongs() {
        fetch(api)
        .then(response => response.json())
        .then(songs => {
            songsList = songs;
            localStorage.setItem(songKey, JSON.stringify(songsList));
            sortList(songsList);
            listSongs(songsList);
        })
        .catch(error => {
            console.error('Error fetching songs', error);
        });
    }

    //Display the songs on the search/browse and sort list when user click on a song.
    function displaySongs(songs){
        listSongs(songs);
        sortList(songs);
    }

    /*LocalStorage to place our songs and display the information, other keep fetching it 
    until song information is found*/

    if(localStorage.getItem(songKey)) {
        songsList = JSON.parse(localStorage.getItem(songKey));
        displaySongs(songsList);
    } else {
        fetchSongs();
    }

    //invoke displayPlaylist
    displayPlayList();

    /*load the save songContent after refreshing the page*/ 
    function loadSongs() {
        const savedPlaylist = localStorage.getItem('playlist');
        return savedPlaylist ? JSON.parse(savedPlaylist) : [];
        
    }

    //This function is used to display the content of the playlist page when song is added, and invoking it above
    function displayPlayList() {
        //displaying the songs li on the playlist-list ul on the markup
        const playlistSongsList = document.querySelector('.playlist-page #playlist-list');
        playlistSongsList.textContent = ''; 
    
        /*Used to store the current list of songs in the playlist retrieved from localStorage
        and make a row for each of the song for each of the song*/
        let playlistData = loadSongs();

        //Calculating the total amount of songs and popularity in the playlist songs.
        const total = playlistData.length;
        let totalPopularity = 0;
        for (let i = 0; i < total; i++) {
        totalPopularity += playlistData[i].popularity;
        }

        let averagePopularity;
        if (total > 0) {
        averagePopularity = totalPopularity / total;
        } else {
        averagePopularity = 0;
        }

        const totalSongsElement = document.querySelector('#total-songs');
        const averagePopularityElement = document.querySelector('#average-popularity');

        totalSongsElement.textContent = `Total Songs: ${total}`;
        averagePopularityElement.textContent = `Average Popularity: ${averagePopularity.toFixed(2)}`;
     
        // appending each of the li elements in the playlist-header to make a list
        for (const song of playlistData) {
            const playlistRow = document.createElement('li');
            playlistRow.appendChild(createSpan(song.title));
            playlistRow.appendChild(createSpan(song.artist));
            playlistRow.appendChild(createSpan(song.year));
            playlistRow.appendChild(createSpan(song.genre));
            playlistRow.appendChild(createSpan(song.popularity));

            // remove button to remove a song from a list
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.className = 'remove-playlist';
            
            //update playlist data when a song is removed
            removeButton.addEventListener('click', function() {
            playlistData = playlistData.filter(pSong => pSong.title !== song.title);
            saveSong(playlistData);
            displayPlayList();
            });

            //Remove all songs button to wipe everything in the list
            const removeSongsButton = document.querySelector('#clear-songs');
            removeSongsButton.addEventListener('click', function () {
                localStorage.removeItem('playlist');
                playlistSongsList.textContent = '';
                displayPlayList();
            });

            playlistRow.appendChild(removeButton);

            playlistRow.addEventListener('click', () => singleSongInfo(song));
            playlistSongsList.appendChild(playlistRow);
        }
    }

    //save the songs when adding to playlist
    function saveSong(playlistData) {
        localStorage.setItem('playlist', JSON.stringify(playlistData));
    }

    //create span for each of the header
    function createSpan(content) {
        const span = document.createElement("span");
        span.textContent = content;
        return span;
    }
    
    //function is to make sure there isn't any duplication of adding songs to playlist
    function addToPlaylist(song, playlistData) {
        console.log("Adding to playlist", song);
        let isDuplicate = false;
    
        //checking for each song if there's any duplication, if there is break the loop.
        for (let i = 0; i < playlistData.length; i++) {
            if (playlistData[i].title === song.title && playlistData[i].artist === song.artist.name) {
                isDuplicate = true;
                break; 
            }
        }
    
        /*if song is not a duplication, push the songs, save them on the playlistData, and display it on the 
        playlist page otherwise popup a snackbar that says that song has already been added.*/
        if (!isDuplicate) {
            playlistData.push({
                title: song.title,
                artist: song.artist.name,
                genre: song.genre.name,
                year: song.year,
                duration: song.details.duration,
                popularity: song.details.popularity,
                bpm: song.details.bpm,
                energy: song.analytics.energy,
                danceability: song.analytics.danceability,
                liveness: song.analytics.liveness,
                valence: song.analytics.valence,
                acousticness: song.analytics.acousticness,
                speechiness: song.analytics.speechiness
            });
            saveSong(playlistData);
            displayPlayList();
            showSnackbar("Song has been added to the Playlist page");
        } else {
            showSnackbar("Song has already been added")
        }
    }

    //Function used to list the songs in the search/browse page
    function listSongs(songsList) {

        //displaying the songs li on the songs-list ul on the markup
        const table = document.querySelector("#songs-list");
        table.textContent = '';
        
        // appending each of the li elements in the songs-list-header to make a list
        for (const song of songsList) {
            const row = document.createElement("li");
            row.appendChild(createSpan(song.title));
            row.appendChild(createSpan(song.artist.name));
            row.appendChild(createSpan(song.year));
            row.appendChild(createSpan(song.genre.name));
            row.appendChild(createSpan(song.details.popularity));
    
            //add button to add the songs to the playlistData and adding it to playlist
            const addButton = document.createElement("button");
            addButton.textContent = "Add";
            addButton.className = "add-playlist";
            addButton.addEventListener('click', function(e) {
                e.stopPropagation(); 
                let playlistData = loadSongs();
                addToPlaylist(song, playlistData);
            });
    
            //adding a span to the add button.
            const buttonSpan = document.createElement("span");
            buttonSpan.appendChild(addButton);
            row.appendChild(buttonSpan);
    
            //when clicking on a row of a certain song, show the song information page with that specific song.
            row.addEventListener('click', () => singleSongInfo(song));
            table.appendChild(row);
        }
    }

    //filter button to filter the songs when a radio button is selected and choosing an option or typing it. 
    document.querySelector('#filterButton').addEventListener('click', function (e) {
        e.preventDefault();
        const selectedFilter = document.querySelector('input[name="chooseSong"]:checked').value;
        filterList(selectedFilter);

    });

    //clear button to revert back to original and enable all the radio button.
     document.querySelector('#clearButton').addEventListener('click', function(e) {
         listSongs(songsList);
         let inputs = e.querySelectorAll('input, select');
         inputs.forEach(input => {
            input.disabled = false;
         });
     });
    
    /*Function is used to filter the list with the radio button that is selected, 
    and adding lowercase to make the searchbox find the specific song*/
    function filterList(radiobutton) {
        let filterSongs;
    
        if(radiobutton === 'title') {
            const searchBox = document.querySelector('.search').value.toLowerCase();
            filterSongs = songsList.filter(song => song.title.toLowerCase().includes(searchBox));
        }  else if (radiobutton === 'artist') {
            const selectArtist = document.querySelector('#artist-select').value;
            filterSongs = songsList.filter(song => String(song.artist.id) === selectArtist);
        } else if (radiobutton === 'genre') {
            const selectGenre = document.querySelector('#genre-select').value;
            filterSongs = songsList.filter(song => String(song.genre.id) === selectGenre);
        } else {
            filterSongs = songsList;
        }
    
        listSongs(filterSongs);
    }

    /* when user click on the arrow beside the span elements in search/browse page, it will sort the list using the sortSongs 
    and list the songs again*/
    function sortList(songsList) {
        const arrows = document.querySelectorAll('.sArrow');
        arrows.forEach(arrow => {
            arrow.addEventListener('click', function() {
                const column = this.dataset.column;
                sortSongs(songsList, column);
                listSongs(songsList);
            });
        });
    }

});

    /* sort the songs where comparing string would be alphbetically but numbers first then A-Z, 
    and if list is a number, it will sort the list in descending order*/
    function sortSongs(songsList, column) {
        songsList.sort((a, b) => {
            let compareA, compareB;

            if(column === "artist.name") {
                compareA = a.artist.name.toLowerCase();
                compareB = b.artist.name.toLowerCase();;
            } else if(column === "genre.name") {
                compareA = a.genre.name.toLowerCase();;
                compareB = b.genre.name.toLowerCase();;
            }

            else if(column === "details.popularity") {
                compareA = a.details.popularity;
                compareB = b.details.popularity;
            }

            else {
                compareA = a[column];
                compareB = b[column];
                if (typeof compareA === 'string') {
                    compareA = compareA.toLowerCase();
                    compareB = compareB.toLowerCase();
                }
            }
    
            if (typeof compareA === 'string') {
                if (compareA < compareB) {
                    return -1;
                }
                if (compareA > compareB) {
                    return 1;
                }
                return 0;
            } else if (typeof compareA === 'number') {
                return compareB - compareA;
            } else {
                return 0;
            }
        });
}

    /*Creating the single song page when a song is clicked, and it will show the 
    information of the song along with its radar chart*/
    let currentChart = null;
    function singleSongInfo(song) {
    console.log("Song in singleSongInfo: ", song);
    //create list on single Song info and analysis song information.
    const singleSongInfo = document.querySelector('.single-song-info');
    const analysisSongInfo = document.querySelector('.analysis-song-info');

    singleSongInfo.textContent = '';
    analysisSongInfo.textContent = '';

    singleSongInfo.appendChild(createListItem(`Title: ${song.title}`));
    singleSongInfo.appendChild(createListItem(`Artist: ${song.artist.name}`));
    singleSongInfo.appendChild(createListItem(`Genre: ${song.genre.name}`));
    singleSongInfo.appendChild(createListItem(`Year: ${song.year}`));
    singleSongInfo.appendChild(createListItem(`Duration: ${formatDuration(song.details.duration)}`));
    
    analysisSongInfo.appendChild(createListItem(`BPM: ${song.details.bpm}`));
    analysisSongInfo.appendChild(createListItem(`Energy: ${song.analytics.energy}`));
    analysisSongInfo.appendChild(createListItem(`danceability: ${song.analytics.danceability}`));
    analysisSongInfo.appendChild(createListItem(`liveness: ${song.analytics.liveness}`));
    analysisSongInfo.appendChild(createListItem(`valence: ${song.analytics.valence}`));
    analysisSongInfo.appendChild(createListItem(`acoustincess: ${song.analytics.acousticness}`));
    analysisSongInfo.appendChild(createListItem(`speechiness: ${song.analytics.speechiness}`));
    analysisSongInfo.appendChild(createListItem(`popularity: ${song.details.popularity}`));

    /* displaying song information on a radar chart*/
    const canvas = document.querySelector('#radarChart');
    if (currentChart) {
        currentChart.destroy();
    }

    //Displaying the data on the radar chart and creating it.
    const radarChartData = {
        labels: ['BPM', 'Energy', 'Danceability', 'Liveness', 'Valence', 'Acousticness', 'Speechiness', 'Popularity'],
        datasets: [{
            label: song.title,
            data: [
                song.details.bpm,
                song.analytics.energy,
                song.analytics.danceability,
                song.analytics.liveness,
                song.analytics.valence,
                song.analytics.acousticness,
                song.analytics.speechiness,
                song.details.popularity
            ],
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
        }]
    };

    const ctx = canvas.getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'radar',
        data: radarChartData,
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    beginAtZero: true
                }
            }
        }
    });
    }
/*create the list on the single song information page*/
function createListItem(text) {
    const listItem = document.createElement('li');
    listItem.textContent = text;
    return listItem;
}

/*getting the option values of the content with the radio button that has a select element*/
function selectOptions(selectID, data) {
    const select = document.querySelector(selectID);
    data.forEach(items=> {
        const option = document.createElement('option');
        option.value = items.id;
        option.textContent = items.name;
        select.appendChild(option);
    });
}

/*snackBar for when adding a song to a page and displaying message*/ 
function showSnackbar(message) {
    const snackbar = document.querySelector("#snackbar");
    snackbar.style.display = "block";
    snackbar.textContent = message;
    snackbar.className = "show";

    setTimeout(() => {
      snackbar.style.display = "none";
    }, 3000);
  }

  // function to converting duration seconds to minutes
  function formatDuration(durationInSeconds) {
    const minutes = parseInt(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;

    // Pad single-digit seconds with a leading zero
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${minutes}:${formattedSeconds}`;
}

  

 
