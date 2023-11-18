function displaySong() {
    const songList = JSON.parse(content3);

    const table = document.querySelector("#songs-list");

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



document.addEventListener("DOMContentLoaded", function() {
    displaySong();

});