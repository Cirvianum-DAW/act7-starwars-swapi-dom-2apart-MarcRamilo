import swapi from './swapi.js';

//Exemple d'inicialització de la llista de pel·lícules. Falten dades!
async function setMovieHeading(movieId, titleSelector,infoSelector, directorSelector) {
  // Obtenim els elements del DOM amb QuerySelector
  const title = document.querySelector(titleSelector);
  const info = document.querySelector(infoSelector);
  const director = document.querySelector(directorSelector);

  // Obtenim la informació de la pelicula
  const movieInfo = await swapi.getMovieInfo(movieId);
  // Injectem
  title.innerHTML = movieInfo.name;
  info.innerHTML = `Episode ${movieInfo.episodeID} - ${movieInfo.release}`;
  director.innerHTML = `Director: ${movieInfo.director}`;
}

async function initMovieSelect(selector) {
 
    const select = document.querySelector(selector);
  
    const movies = await swapi.listMoviesSorted();
    //first option Selecciona una pel·lícula creating element
    const option = document.createElement("option");
    option.value = "";
    option.text = "Selecciona una pel·lícula";
    //inject
    select.appendChild(option);
    //use _filmIdToEpisodeId to get the episodeID
    
    movies.forEach((movie) => {
      const option = document.createElement("option");
      option.value = _filmIdToEpisodeId(movie.episodeID);
      option.textContent = movie.name;
      select.appendChild(option);
    }
     
    );

    
    //change the values of setMovieHeading sending the id selected
    setMovieSelectCallbacks();



   

    
  
}

function deleteAllCharacterTokens() {}

// EVENT HANDLERS //

function addChangeEventToSelectHomeworld() {

  const select = document.querySelector('#select-homeworld');
  select.addEventListener('change', _handleOnSelectHomeworldChanged);
}

async function _createCharacterTokens() {

}

function _addDivChild(parent, className, html) {

}

function setMovieSelectCallbacks() {
  const select = document.querySelector('#select-movie');
  select.addEventListener('change', _handleOnSelectMovieChanged);
}

async function _handleOnSelectMovieChanged(event) {
  const episodeID = event.target.value;
  if (episodeID) {
    const movie = await swapi.getMovieCharactersAndHomeworlds(episodeID);
    _setMovieHeading(movie);
    console.log(movie);
    _populateHomeWorldSelector(_removeDuplicatesAndSort(movie.characters.map((character) => character.homeworld)));
  } else {
    //when epsiode id is empty we reset the movie heading
    _setMovieHeading({ name: '', episodeID: '', release: '', director: '' });
    //and clean filter options homeworld
    _populateHomeWorldSelector([]);
  }
}

function _filmIdToEpisodeId(episodeID) {
  const mapping = episodeToMovieIDs.find((element) => element.m === episodeID).e;
  if (mapping) {
    return mapping;
  } else{
    return null;
  }
}

// "https://swapi.dev/api/films/1/" --> Episode_id = 4 (A New Hope)
// "https://swapi.dev/api/films/2/" --> Episode_id = 5 (The Empire Strikes Back)
// "https://swapi.dev/api/films/3/" --> Episode_id = 6 (Return of the Jedi)
// "https://swapi.dev/api/films/4/" --> Episode_id = 1 (The Phantom Menace)
// "https://swapi.dev/api/films/5/" --> Episode_id = 2 (Attack of the Clones)
// "https://swapi.dev/api/films/6/" --> Episode_id = 3 (Revenge of the Sith)

let episodeToMovieIDs = [
  { m: 1, e: 4 },
  { m: 2, e: 5 },
  { m: 3, e: 6 },
  { m: 4, e: 1 },
  { m: 5, e: 2 },
  { m: 6, e: 3 },
];

function _setMovieHeading({ name, episodeID, release, director }) {
  const title = document.querySelector('.movie__title');
  const info = document.querySelector('.movie__info');
  const directorElement = document.querySelector('.movie__director');
  title.textContent = name;
  info.textContent = `Episode ${episodeID} - ${release}`;
  directorElement.textContent = `Director: ${director}`;

  return episodeID;
}

function _populateHomeWorldSelector(homeworlds) {
 //get de homeworlds
  const select = document.querySelector('#select-homeworld');
  //remove all options
  select.innerHTML = '';
  //create the first option
  const option = document.createElement('option');
  option.value = '';
  option.textContent = 'Selecciona un planeta';
  select.appendChild(option);
  //create the options
  homeworlds.forEach((homeworld) => {
    const option = document.createElement('option');
    option.value = homeworld;
    option.textContent = homeworld;
    select.appendChild(option);
  });
}

/**
 * Funció auxiliar que podem reutilitzar: eliminar duplicats i ordenar alfabèticament un array.
 */
function _removeDuplicatesAndSort(elements) {
  // Al crear un Set eliminem els duplicats
  const set = new Set(elements);
  // tornem a convertir el Set en un array
  const array = Array.from(set);
  // i ordenem alfabèticament
  return array.sort(swapi._compareByName);
}

const act7 = {
  setMovieHeading,
  setMovieSelectCallbacks,
  initMovieSelect,
  deleteAllCharacterTokens,
  addChangeEventToSelectHomeworld,
};

export default act7;
