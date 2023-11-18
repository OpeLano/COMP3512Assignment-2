document.addEventListener("DOMContentLoaded", function() {
    const songList = JSON.parse(content3);
    displaySong(songList);
    setupHeaderClickListeners(songList);
});

function displaySong(songList) {

    const table = document.querySelector("#songs-list");
    table.innerHTML = '';

    for (const song of songList) {

        const row = document.createElement("tr");

        const title = document.createElement("td");
        title.innerHTML = `<a href="#" onclick="showSingleSong(${song.song_id})">${song.title}</a>`;

        const artist = document.createElement("td");
        artist.textContent = song.artist.name;

        const year = document.createElement("td");
        year.textContent = song.year;

        const genre = document.createElement("td");
        genre.textContent = song.genre.name;

        const popularity = document.createElement("td");
        popularity.textContent = song.details.popularity;

        row.appendChild(title);
        row.appendChild(artist);
        row.appendChild(year);
        row.appendChild(genre);
        row.appendChild(popularity);

        table.appendChild(row);
    }
}

function showSingleSong(song_id) {
    const songsData = {
        "song": {
            title: "Song",
            artist: "Artist",
            year: 2022,
            genre: "Genre",
            popularity: "Pop"
        },
    };

    const song = songsData[`song${song_id}`];
       
    const singleSongElement = document.querySelector("#songs-list");

        singleSongElement.innerHTML = `
            <h3>${song.title}</h3>
            <p>Artist: ${song.artist}</p>
            <p>Year: ${song.year}</p>
            <p>Genre: ${song.genre}</p>
            <p>Popularity: ${song.popularity}</p>
        `;  
}

function setupHeaderClickListeners(songList) {
    const ths = document.querySelectorAll('#songs-table th');
    for (const th of ths) {
        th.addEventListener('click', function(e) {
            const headerText = th.innerText.toLowerCase().replace(/\s+/g, '');
            let sortColumn;

            if (headerText === 'title') {
                sortColumn = 'title';
            } else if (headerText === 'artist') {
                sortColumn = 'artist.name';
            } else if (headerText === 'year') {
                sortColumn = 'year';
            } else if (headerText === 'genre') {
                sortColumn = 'genre.name';
            } else if (headerText === 'popularity') {
                sortColumn = 'details.popularity';
            }

            sortSongs(songList, sortColumn);
            displaySong(songList);
        });
    }
}

function sortSongs(songList, column) {
    songList.sort((a, b) => {
        let aValue;
        let bValue;

        if(column === 'title') {
            aValue = a.title;
            bValue = b.title;
        } else if(column === 'artist.name') {
            aValue = a.artist.name;
            bValue = b.artist.name;
        } else if(column === 'year') {
            aValue = a.year;
            bValue = b.year;
        } else if (column === 'genre.name') {
            aValue = a.genre.name;
            bValue = b.genre.name;
        }
        else if (column === 'details.popularity') {
            aValue = a.details.popularity;
            bValue = b.details.popularity;
        }

        if(typeof aValue === 'number' && typeof bValue === 'number') {
            return bValue - aValue;
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
            return aValue.localeCompare(bValue);
        } else {
            return 0;
        }
});
}


