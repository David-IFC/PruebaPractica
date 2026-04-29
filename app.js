/**
 * NATALIE PORTMAN WEB - API INTEGRATION (TMDb)
 * Este script obtiene datos en tiempo real de TMDb para biografía, filmografía e imágenes.
 */

const API_KEY = 'f22445005790f4bf51fd463bad906531';
const PERSON_ID = '524'; // ID de Natalie Portman en TMDb
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const HERO_IMAGE_URL = 'https://image.tmdb.org/t/p/original';

async function fetchPortmanData() {
    try {
        // 1. Detalles de la persona
        const personResponse = await fetch(`${BASE_URL}/person/${PERSON_ID}?api_key=${API_KEY}&language=es-ES`);
        const personData = await personResponse.json();

        // 2. Créditos de películas
        const moviesResponse = await fetch(`${BASE_URL}/person/${PERSON_ID}/movie_credits?api_key=${API_KEY}&language=es-ES`);
        const moviesData = await moviesResponse.json();

        // 3. Imágenes adicionales
        const imagesResponse = await fetch(`${BASE_URL}/person/${PERSON_ID}/images?api_key=${API_KEY}`);
        const imagesData = await imagesResponse.json();

        updateUI(personData, moviesData.cast, imagesData.profiles);
    } catch (error) {
        console.error('Error al obtener datos de TMDb:', error);
    }
}

function updateUI(person, movies, profiles) {
    // Imagen Hero: Usar la primera imagen de perfil disponible
    const heroImg = document.querySelector('.hero-image');
    if (profiles && profiles.length > 0) {
        heroImg.src = `${HERO_IMAGE_URL}${profiles[0].file_path}`;
    } else if (person.profile_path) {
        heroImg.src = `${HERO_IMAGE_URL}${person.profile_path}`;
    }

    // Imagen Biografía: Usar una imagen diferente (la segunda si existe)
    const bioImg = document.querySelector('.rounded-img');
    if (profiles && profiles.length > 1) {
        bioImg.src = `${IMAGE_BASE_URL}${profiles[1].file_path}`;
    } else if (person.profile_path) {
        bioImg.src = `${IMAGE_BASE_URL}${person.profile_path}`;
    }

    // Actualizar Filmografía (Top 4 películas por popularidad o voto)
    const movieGrid = document.querySelector('.movie-grid');
    const topMovies = movies
        .sort((a, b) => b.vote_average - a.vote_average)
        .slice(0, 4);

    if (topMovies.length > 0) {
        movieGrid.innerHTML = topMovies.map(movie => `
            <article class="movie-card">
                ${movie.poster_path ? `<img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="Póster de ${movie.title}" class="movie-poster">` : ''}
                <div class="movie-info">
                    <h3>${movie.title} (${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'})</h3>
                    <p>${movie.character ? `Interpretó a: ${movie.character}` : ''}</p>
                    <p class="rating">⭐ ${movie.vote_average.toFixed(1)}/10</p>
                </div>
            </article>
        `).join('');
    }
    }
}

// Iniciar la carga de datos
document.addEventListener('DOMContentLoaded', fetchPortmanData);
