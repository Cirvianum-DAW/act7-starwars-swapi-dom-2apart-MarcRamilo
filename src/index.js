import { getMovieCount } from './swapi.js';

// Aquest index només serveix per provar algunes funcions si vols fer ús de la consola
// per provar les funcions que has creat.

async function main() {
  try {
    const numberOfMovies = await getMovieCount();
    console.log(numberOfMovies);
  } catch (error) {
    console.error(error);
  }
}

main();

export default main;
