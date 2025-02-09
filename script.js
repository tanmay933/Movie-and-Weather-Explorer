const  apiKeyWeather = '633376f129c6b6b2359e9e7e07fcf29b' ; 
 const apiKeyMovie =  '59563c50d34c02f87327ad4613f82615'  ; 

document.getElementById('searchBtn').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value;
     if (!city) return alert(" Please enter a city name! ");

    const  weatherData  = await getWeather(city);
     if (!weatherData) return;

     const movieData = await getMovieRecommendation(weatherData);
      displayResults(weatherData  , movieData);
});

async function getWeather(city) {
    try {
       const  url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKeyWeather}&units=metric`;
         const response = await fetch(url);
        const  data = await response.json();
        if (data.cod !== 200) throw new Error(data.message);
        return data;
    } catch (error) {
        alert("Weather API Error:  " + error.message);
        return null;
    }
}

async function getMovieRecommendation(weatherData) {
   const weatherCondition  =  weatherData.weather[0].main.toLowerCase();
     const genreId  =  getGenreFromWeather(weatherCondition);
    
    if (!genreId) return null;

    try {
       const url  = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKeyMovie}&with_genres=${genreId}&sort_by=popularity.desc`;
        const response=  await fetch(url);
       const data  =  await response.json();
        return data.results.length ? data.results[0] : null;
    } catch (error) {
        alert("Movie API Error: " + error.message);
        return null;
    }
}

function getGenreFromWeather(condition) {
    const genreMap = {
        "clear": 12, 
         "clouds": 35, 
        "rain": 53, 
         "snow": 16, 
         "thunderstorm": 27 
    };
   return genreMap[condition] || 18; 
}

function displayResults(weatherData, movieData) {
    document.getElementById('weatherResult').innerHTML = `
         <h2>Weather in ${weatherData.name}</h2>
        <p>${weatherData.weather[0].description}, ${weatherData.main.temp}°C</p>
    `;

    if (movieData) {
        document.getElementById('movieResult').innerHTML = `
            <h2>Movie Recommendation</h2>
             <h3>${movieData.title}</h3>
            <p>${movieData.overview}</p>
             <img src="https://image.tmdb.org/t/p/w500${movieData.poster_path}" alt="${movieData.title}">
        `;
    } else {
        document.getElementById('movieResult').innerHTML = `<p>No movie recommendations available.</p>`;
    }
}
