import swapi from './swapi.js';

//Exemple d'inicialització de la llista de pel·lícules. Falten dades!
async function setMovieHeading(movieId, titleSelector, infoSelector, directorSelector) {
  // Obtenim els elements del DOM amb QuerySelector
  const title = document.querySelector(titleSelector);  
  const info = document.querySelector(infoSelector)
  const director = document.querySelector(directorSelector)

  console.log(movieId)

  if (!movieId){
    title.innerHTML = ''
    info.innerHTML = ''
    director.innerHTML = ''
    return
  }
  const movieInfo = await swapi.getMovieInfo(movieId);
  // Inject
  title.innerHTML = movieInfo.name
  info.innerHTML = `Episode ${movieInfo.episodeID} - ${movieInfo.release}`
  director.innerHTML = `Director: ${movieInfo.director}`
}

async function initMovieSelect(selector) {
  const movies = await swapi.listMoviesSorted();
  //console.log(movies)
  
  const select = document.querySelector(selector);

  const option = document.createElement('option')
  
  option.value = '';
  option.textContent = "Selecciona una pel·lícula" 
  select.appendChild(option)


  movies.forEach(movie => {
    const option = document.createElement('option')
    option.value = _filmIdToEpisodeId(movie.episodeID)
    option.textContent = movie.name
    select.appendChild(option)
  })
}



// EVENT HANDLERS //

// function addChangeEventToSelectHomeworld() {
//   const selectHomeworld = document.querySelector('#select-homeworld');
//   selectHomeworld.addEventListener('change', _handleOnSelectHomeworldChanged);
// }

function addChangeEventToSelectHomeworld() {
  const selectHomeworld = document.querySelector('#select-homeworld');
  selectHomeworld.addEventListener('change', _handleOnSelectHomeworldChanged);
}

// Handle the change event of the homeworld select dropdown
async function _handleOnSelectHomeworldChanged(event) {
  const homeworld = event.target.value;
const characters = await swapi.getMovieCharactersAndHomeworlds(1);
const filteredCharacters = characters.characters.filter(character => character.homeworld === homeworld);
  //if filteredCharacters is empty, show a missatge
  if (filteredCharacters.length === 0) {
    const list = document.querySelector('.list__characters');
    list.innerHTML = '';
    const li = document.createElement('li');
    li.classList.add('list__item', 'item', 'character');
    li.textContent = 'No characters found';
    list.appendChild(li);
    return;
  }
  const list = document.querySelector('.list__characters');
  list.innerHTML = '';

  filteredCharacters.forEach(character => {
    const li = document.createElement('li');
    li.classList.add('list__item', 'item', 'character');
  
    const img = document.createElement('img');
    //image for id character /public/assets/people/numberarray.jpg get the id from url:"https://swapi.info/api/people/id" from id
    //get url
    const url = character.url;
    //get id
    const id = url.split("/")[5];
    img.src = `./assets/people/${id}.jpg`;
    img.classList.add('character__image');
    li.appendChild(img);
  
    const h2 = document.createElement('h2');
    h2.classList.add('character__name');
    h2.textContent = character.name;
    li.appendChild(h2);
  
    _addDivChild(li, 'character__birth', `<strong>Birth Year:</strong> ${character.birth_year}`);
    _addDivChild(li, 'character__eye', `<strong>Eye color:</strong> ${character.eye_color}`);
    _addDivChild(li, 'character__gender', `<strong>Gender:</strong> ${character.gender}`);
    _addDivChild(li, 'character__home', `<strong>Home World:</strong> ${character.homeworld}`);

    list.appendChild(li);

  });
  

}

async function _createCharacterTokens() {
  const characters = await swapi.getMovieCharactersAndHomeworlds(1);
  const list = document.querySelector('.list__characters');
  characters.characters.forEach(character => {
    const token = document.createElement('div');
    token.classList.add('token');
    token.textContent = character.name;
    list.appendChild(token);
  });
}

function _addDivChild(parent, className, innerHTML) {
  const div = document.createElement('div');
  div.className = className;
  div.innerHTML = innerHTML;
  parent.appendChild(div);
}

function setMovieSelectCallbacks() {
  const selectMovie = document.querySelector('#select-movie')

  selectMovie.addEventListener('change', _handleOnSelectMovieChanged)
}

async function _handleOnSelectMovieChanged(event) {
  const movieID = event.target.value
  
    await setMovieHeading(movieID, '.movie__title', '.movie__info', '.movie__director');

    const selector = document.querySelector('#select-homeworld');
    selector.innerHTML = '';


  const caracters = await swapi.getMovieCharactersAndHomeworlds(movieID);
  if (caracters.characters.length === 0) {
    const list = document.querySelector('.list__characters');
    list.innerHTML = '';
    const li = document.createElement('li');
    li.classList.add('list__item', 'item', 'character');
    li.textContent = 'No characters found';
    list.appendChild(li);
    return;
  }
  const planetes = caracters.characters.map((caracter) => caracter.homeworld);

  const planetesNoDuplicats = _removeDuplicatesAndSort(planetes);

  _populateHomeWorldSelector(planetesNoDuplicats, selector);

  const pr = document.querySelector('.list__characters');
  document.querySelector('.list__characters').innerHTML = '';
  caracters.characters.forEach((character) => {
    const li = document.createElement('li');
    li.classList.add('list__item', 'item', 'character');
  
    const img = document.createElement('img');
    //image for id character /public/assets/people/numberarray.jpg get the id from url:"https://swapi.info/api/people/id" from id
    //get url
    const url = character.url;
    //get id
    const id = url.split("/")[5];
    img.src = `./assets/people/${id}.jpg`;
    img.classList.add('character__image');
    li.appendChild(img);
  
    const h2 = document.createElement('h2');
    h2.classList.add('character__name');
    h2.textContent = character.name;
    li.appendChild(h2);
  
    _addDivChild(li, 'character__birth', `<strong>Birth Year:</strong> ${character.birth_year}`);
    _addDivChild(li, 'character__eye', `<strong>Eye color:</strong> ${character.eye_color}`);
    _addDivChild(li, 'character__gender', `<strong>Gender:</strong> ${character.gender}`);
    _addDivChild(li, 'character__home', `<strong>Home World:</strong> ${character.homeworld.name}`);
  
    document.querySelector('.list__characters').appendChild(li);
  });


    
}

function _filmIdToEpisodeId(episodeID) {
  const mapping = episodeToMovieIDs.find(item => item.e === episodeID)
  if (mapping){
    return mapping.m
  } else {
    return null
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
  title.textContent = name;

  const info = document.querySelector('.movie__info');
  info.textContent = `Episode ${episodeID} - ${release}`;

  const directorElement = document.querySelector('.movie__director');
  directorElement.textContent = `Director: ${director}`;
}

function _populateHomeWorldSelector(homeworlds, selector) {
 
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Selecciona un homeworld';
    selector.appendChild(option);

    homeworlds.forEach(planeta => {
      const option = document.createElement('option');
      option.value = planeta;
      option.textContent = planeta;
      selector.appendChild(option);
      })
}

/**
 * Funció auxiliar que podem reutilitzar: eliminar duplicats i ordenar alfabèticament un array.
 */
function _removeDuplicatesAndSort(elements) {
  // Al crear un Set eliminem els duplicats
  const set = new Set(elements);
  // tornem a convertir el Set en un array
  const array = [...set].sort();
  // i ordenem alfabèticament
  return array;
}

const act7 = {
  setMovieHeading,
  setMovieSelectCallbacks,
  addChangeEventToSelectHomeworld,
  initMovieSelect,
  // deleteAllCharacterTokens,
  addChangeEventToSelectHomeworld,
};

export default act7;
