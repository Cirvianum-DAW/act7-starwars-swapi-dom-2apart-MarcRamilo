import act7 from './act7.js';

console.log('Benvingut a MP6 de DAW!');

// Inicialitzem el selector de pel·lícules
act7.setMovieHeading(1, '#movie-title', '#movie-info', '#movie-director');
// Iniciem el selector de pel·lícules
act7.initMovieSelect('#select-movie');
act7.setMovieSelectCallbacks();
act7.addChangeEventToSelectHomeworld();
act7.deleteAllCharacterTokens();
act7.addChangeEventToSelectHomeworld();
act7.addChangeEventToSelectMovie();
