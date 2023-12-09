
document.addEventListener("DOMContentLoaded", function () {

    const searchPage = document.querySelector('.search-page');
    const songDisplayPage = document.querySelector('.song-display');
    const closeButton = document.querySelector('#close-view-button');
    const hideButton = document.querySelector('.hide-button');
    const playlistButton = document.querySelector('#playlist-button');
    const playlistPage = document.querySelector('.playlist-page');
    const hideplayListButton = document.querySelector('.hide-playlist-button');
    const songsListHeader = document.querySelector('.songs-list');

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

    closeButton.addEventListener('click', function () {
        showPage([searchPage], true); 
        showPage([songDisplayPage, playlistPage], false); 
        showPage([hideButton], false); 
        showPage([hideplayListButton], true); 
    });
    
    songsListHeader.addEventListener('click', function (e) {
        if (e.target.tagName === 'SPAN') {
            showPage([searchPage, playlistPage], false); 
            showPage([songDisplayPage], true); 
            showPage([hideButton], true); 
            showPage([hideplayListButton], false); 
        }
    });
    
    playlistButton.addEventListener('click', function () {
        showPage([searchPage, songDisplayPage], false); 
        showPage([playlistPage, hideButton], true); 
        showPage([hideplayListButton], false); 
    });

    console.log("DOM fully loaded and parsed");

    document.querySelectorAll('input[type=radio][name="chooseSong"]').forEach(function(radio) {
        console.log("Attaching event listener to:", radio);
        radio.addEventListener('change', function() {
            console.log("Radio button changed - simplified test"); 
            console.log("Radio button changed:", radio.value);
            document.querySelectorAll('.form-group').forEach(function(group) {
                console.log("Checking group: ", group);
                if (!group.contains(radio)) {
                    group.style.opacity = '0.5';
                    let inputs = group.querySelectorAll('input, select');
                    inputs.forEach(input => {
                        input.disabled = true;
                        console.log("Disabling input: ", input);
                    });
                } else {
                    group.style.opacity = '1';
                    let inputs = group.querySelectorAll('input, select');
                    inputs.forEach(input => {
                        input.disabled = false;
                        console.log("Enabling input: ", input);
                    });
                }
            });
        });
    });

    /* url of song api --- https versions hopefully a little later this semester */	
    const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';
    const artist = JSON.parse(content1);
    const genres = JSON.parse(content2);


    //for the select values of artist and genres
    selectOptions('#artist-select', artist);
    selectOptions('#genre-select', genres);


    //fetch
    let songsList = [];
    const songKey = 'songsKey';

    function fetchSongs() {
        fetch(api)
        .then(response => response.json())
        .then(songs => {
            console.log('Fetched Songs:', songs); 
            songsList = songs;
            localStorage.setItem(songKey, JSON.stringify(songsList));
            sortList(songsList);
            listSongs(songsList);
        })
        .catch(error => {
            console.error('Error fetching songs', error);
        });
    }

    function displaySongs(songs){
        console.log('Displaying Songs:', songs); 
        listSongs(songs);
        sortList(songs);
    }

    //localStorage 

    if(localStorage.getItem(songKey)) {
        songsList = JSON.parse(localStorage.getItem(songKey));
        displaySongs(songsList);
    } else {
        fetchSongs();
    }

    displayPlayList();

    function loadSongs() {
        const savedPlaylist = localStorage.getItem('playlist');
        return savedPlaylist ? JSON.parse(savedPlaylist) : [];
    }

    function displayPlayList() {
        const playlistElement = document.querySelector('.playlist-page #playlist-list');
        playlistElement.textContent = ''; // Clears the existing playlist
    
        let playlistData = loadSongs();
        for (const song of playlistData) {
            const playlistRow = document.createElement('li');
    
            // Assuming you want to display the title, artist, and other details in the playlist
            playlistRow.innerHTML = `
                <span>${song.title}</span>
                <span>${song.artist}</span>
                <span>${song.year}</span>
                <span>${song.genre}</span>
                <span>${song.popularity}</span>
            `;
    
            // Optionally, you can add a remove button to each song in the playlist
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.className = 'remove-playlist';
            removeButton.addEventListener('click', function() {
                // Logic to remove the song from playlistData and update local storage

                playlistData = playlistData.filter(pSong => pSong.title !== song.title);

            // Save the updated playlist
            saveSong(playlistData);

            // Re-display the updated playlist
            displayPlayList();
            });
            playlistRow.appendChild(removeButton);
    
            playlistElement.appendChild(playlistRow); // Adds the new row to the playlist
        }
    }

    function saveSong(playlist) {
        localStorage.setItem('playlist', JSON.stringify(playlist));
    }

    function createSpanElement(content) {
        const span = document.createElement("span");
        span.textContent = content;
        return span;
    }
    
    function addToPlaylist(song, playlistData) {
        if (!playlistData.some(pSong => pSong.title === song.title && pSong.artist === song.artist.name)) {
            playlistData.push({
                title: song.title,
                artist: song.artist.name,
                year: song.year,
                genre: song.genre.name,
                popularity: song.details.popularity
            });
            saveSong(playlistData);
            displayPlayList();
        } else {
            console.log("Song already in the playlist");
        }
    }

    function listSongs(songsList) {
        const table = document.querySelector("#songs-list");
        table.textContent = '';
    
        songsList.forEach(song => {
            const row = document.createElement("li");
            row.appendChild(createSpanElement(song.title));
            row.appendChild(createSpanElement(song.artist.name));
            row.appendChild(createSpanElement(song.year));
            row.appendChild(createSpanElement(song.genre.name));
            row.appendChild(createSpanElement(song.details.popularity));
    
            const addButton = document.createElement("button");
            addButton.textContent = "Add";
            addButton.className = "add-playlist";
            addButton.addEventListener('click', function(event) {
            event.stopPropagation(); 
            let playlistData = loadSongs();
            addToPlaylist(song, playlistData);

            showSnackbar();
            });

            const buttonSpan = document.createElement("span");
            buttonSpan.appendChild(addButton);
            row.appendChild(buttonSpan);

            row.addEventListener('click', () => singleSongInfo(song));

            table.appendChild(row);
    });
    }


    document.querySelector('#filterButton').addEventListener('click', function (e) {
        e.preventDefault();
        const selectedFilter = document.querySelector('input[name="chooseSong"]:checked').value;
        filterList(selectedFilter);

    });

     document.querySelector('#clearButton').addEventListener('click', function(e) {
         listSongs(songsList);
         inputs.forEach(input => {
            input.disabled = false;
         });
         e.preventDefault();
     });


    
    function filterList(column) {
        let filterSongs;
    
        if(column === 'title') {
            const searchBox = document.querySelector('.search').value.toLowerCase();
            filterSongs = songsList.filter(song => song.title.toLowerCase().includes(searchBox));
        }  else if (column === 'artist') {
            const selectArtist = document.querySelector('#artist-select').value;
            filterSongs = songsList.filter(song => String(song.artist.id) === selectArtist);
        } else if (column === 'genre') {
            const selectGenre = document.querySelector('#genre-select').value;
            filterSongs = songsList.filter(song => String(song.genre.id) === selectGenre);
        } else {
            filterSongs = songsList;
        }
    
        listSongs(filterSongs);
    }

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

let currentChart = null;
function singleSongInfo(song) {
    const singleSongInfo = document.querySelector('.single-song-info');
    const analysisSongInfo = document.querySelector('.analysis-song-info');

    singleSongInfo.textContent = '';
    analysisSongInfo.textContent = '';

    singleSongInfo.appendChild(createListItem(`Title: ${song.title}`));
    singleSongInfo.appendChild(createListItem(`Artist: ${song.artist.name}`));
    singleSongInfo.appendChild(createListItem(`Genre: ${song.genre.name}`));
    singleSongInfo.appendChild(createListItem(`Year: ${song.year}`));
    singleSongInfo.appendChild(createListItem(`Duration: ${song.details.duration}`));
    
    analysisSongInfo.appendChild(createListItem(`BPM: ${song.details.bpm}`));
    analysisSongInfo.appendChild(createListItem(`Energy: ${song.analytics.energy}`));
    analysisSongInfo.appendChild(createListItem(`danceability: ${song.analytics.danceability}`));
    analysisSongInfo.appendChild(createListItem(`liveness: ${song.analytics.liveness}`));
    analysisSongInfo.appendChild(createListItem(`valence: ${song.analytics.valence}`));
    analysisSongInfo.appendChild(createListItem(`acoustincess: ${song.analytics.acousticness}`));
    analysisSongInfo.appendChild(createListItem(`speechiness: ${song.analytics.speechiness}`));
    analysisSongInfo.appendChild(createListItem(`popularity: ${song.details.popularity}`));

    const canvas = document.querySelector('#radarChart');
    // If there's a chart already drawn, destroy it
    if (currentChart) {
        currentChart.destroy();
    }

    // Prepare the data for the radar chart
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

    // Get the context of the canvas element
    const ctx = canvas.getContext('2d');
    // Create a new chart instance
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

function createListItem(text) {
    const listItem = document.createElement('li');
    listItem.textContent = text;
    return listItem;
}

function selectOptions(selectID, data) {
    const select = document.querySelector(selectID);
    data.forEach(items=> {
        const option = document.createElement('option');
        option.value = items.id;
        option.textContent = items.name;
        select.appendChild(option);
    });
}
 
function showSnackbar() {
    const snackbar = document.querySelector("#snackbar");
    snackbar.style.display = "block"; 
    setTimeout(() => {
      snackbar.style.display = "none";
    }, 3000);
  }