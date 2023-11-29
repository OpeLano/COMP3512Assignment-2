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

    //come back later
    // const searchBox = document.querySelector('.search');
    // const suggestions = document.querySelector('#filterList');
    // searchBox.addEventListener('input', displayMatches);

    // function displayMatches() {
    //     if(this.value >= 2) {
    //         const matches = findMatches(this.value, songsList);
    //         suggestions.innerHTML = '';

    //         matches.forEach(song => {
    //             let option = document.createElement('option');
    //             option.textContent = song.title;
    //             suggestions.appendChild(option);
    //         });
    //     }
    // }

    // function findMatches(wordToMatch, songsList) {
    //     return songsList.filter(song => {
    //         const regex = new RegExp(wordToMatch, 'gi');
    //         return song.title.match(regex);
    //     });
    // }

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
            filterSongs = songsList.filter(song => song.title.toLowerCase() === searchBox);
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
    table.innerHTML = '';  

    songsList.forEach(song => {
        const row = document.createElement("li");
        row.innerHTML = `
            <span><a href="#"${song.song_id}">${song.title}</a></span>
            <span>${song.artist.name}</span>
            <span>${song.year}</span>
            <span>${song.genre.name}</span>
            <span>${song.details.popularity}</span>
            <span><button class="add-playlist">Add</button></span>`;
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

   
   


    
