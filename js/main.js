document.addEventListener("DOMContentLoaded", function () {

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
    const api = 'http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';
    const artist = JSON.parse(content1);
    const genres = JSON.parse(content2);


    //for the select values of artist and genres
    selectOptions('#artist-select', artist);
    selectOptions('#genre-select', genres);

    const songsList = [];

    fetch(api)
    .then(response => response.json())
    .then(songs => {
        songsList.push(...songs);
        listSongs(songsList);
        sortList(songsList);
    })
    .catch(error => console.error('Error here', error));

    document.querySelector('#filterButton').addEventListener('click', function (e) {
        e.preventDefault();
        const selectedFilter = document.querySelector('input[name="chooseSong"]:checked').value;
        filterList(selectedFilter);

    });

    document.querySelector('.clearButton').addEventListener('click', function(e) {
        e.preventDefault();
        listSongs(songsList);
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


function listSongs(songsList) {
    const table = document.querySelector("#songs-list");
    table.textContent = '';  

    songsList.forEach(song => {
        const row = document.createElement("li");

        // Title
        const titleSpan = document.createElement("span");
        const titleLink = document.createElement("a");
        titleLink.href = "#"; 
        titleLink.textContent = song.title; 
        titleSpan.appendChild(titleLink);
        row.appendChild(titleSpan);

        // Artist
        const artistSpan = document.createElement("span");
        artistSpan.textContent = song.artist.name;
        row.appendChild(artistSpan);

        // Year
        const yearSpan = document.createElement("span");
        yearSpan.textContent = song.year;
        row.appendChild(yearSpan);

        // Genre
        const genreSpan = document.createElement("span");
        genreSpan.textContent = song.genre.name;
        row.appendChild(genreSpan);

        // Popularity
        const popularitySpan = document.createElement("span");
        popularitySpan.textContent = song.details.popularity;
        row.appendChild(popularitySpan);

        // Add button
        const buttonSpan = document.createElement("span");
        const addButton = document.createElement("button");
        addButton.textContent = "Add";
        addButton.className = "add-playlist";
        buttonSpan.appendChild(addButton);
        row.appendChild(buttonSpan);

        table.appendChild(row);
    });
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

   
   


    
