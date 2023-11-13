document.addEventListener("DOMContentLoaded", function () {

   const artist = JSON.parse(content1);
   const genres = JSON.parse(content2);
   const songs = JSON.parse(content3);

   optionSelect('#artist-select', artist);
   optionSelect('#genre-select', genres);
   
   /* url of song api --- https versions hopefully a little later this semester */	
   const api = 'http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';

function optionSelect(idSelector, data) {
const select = document.querySelector(idSelector);

for(const items of data) {
   const option = document.createElement('option');

   option.value = items.id;
   option.textContent = items.name;

   select.appendChild(option);
}

}
});


 