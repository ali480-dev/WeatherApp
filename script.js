const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const wind = document.getElementById("wind");
const humidity = document.getElementById("humidity");
const weatherIcon = document.getElementById("weatherIcon");
const message = document.getElementById("message");


searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name.";
        return;
    }

    displayWeather(city);
});


cityInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        searchBtn.click();
    }

});


async function displayWeather(city) {

    try {

        message.textContent = "Loading...";

        // Get city coordinates
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!locationResponse.ok) {
            throw new Error("Unable to find location.");
        }

        const locationData = await locationResponse.json();

        if (!locationData.results) {
            throw new Error("City not found.");
        }

        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Get weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to get weather data.");
        }

        const weatherData = await weatherResponse.json();

        const currentWeather = weatherData.current;

        // Display city
        cityName.textContent = `${location.name}, ${location.country}`;

        // Display temperature
        temperature.textContent = `${currentWeather.temperature_2m}°C`;

        // Display humidity
        humidity.textContent = `${currentWeather.relative_humidity_2m}%`;

        // Display wind
        wind.textContent = `${currentWeather.wind_speed_10m} km/h`;

        // Get weather information
        const weatherInfo = getWeatherInfo(currentWeather.weather_code);

        condition.textContent = weatherInfo.condition;
        weatherIcon.textContent = weatherInfo.icon;

        message.textContent = "";

    } catch (error) {

        message.textContent = error.message;

        cityName.textContent = "Weather";
        temperature.textContent = "--°C";
        condition.textContent = "--";
        wind.textContent = "-- km/h";
        humidity.textContent = "--%";
        weatherIcon.textContent = "🌤️";

    }

}


function getWeatherInfo(code) {

    if (code === 0) {
        return {
            condition: "Clear Sky",
            icon: "☀️"
        };
    }

    if (code === 1 || code === 2) {
        return {
            condition: "Partly Cloudy",
            icon: "🌤️"
        };
    }

    if (code === 3) {
        return {
            condition: "Cloudy",
            icon: "☁️"
        };
    }

    if (code >= 51 && code <= 57) {
        return {
            condition: "Drizzle",
            icon: "🌦️"
        };
    }

    if (code >= 61 && code <= 67) {
        return {
            condition: "Rain",
            icon: "🌧️"
        };
    }

    if (code >= 71 && code <= 77) {
        return {
            condition: "Snow",
            icon: "❄️"
        };
    }

    if (code >= 80 && code <= 82) {
        return {
            condition: "Rain Showers",
            icon: "🌦️"
        };
    }

    if (code >= 95) {
        return {
            condition: "Thunderstorm",
            icon: "⛈️"
        };
    }

    return {
        condition: "Unknown",
        icon: "🌤️"
    };
}