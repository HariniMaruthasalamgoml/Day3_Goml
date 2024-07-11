console.log("this is working");

async function fetchApiKey() {
    try {
        const response = await fetch('/api/key');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.apiKey;
    } catch (error) {
        console.error('Error fetching API key:', error);
        document.getElementById('weather-report').innerHTML = '<p>Error fetching API key. Please try again later.</p>';
    }
}

async function fetchWeather(latitude, longitude) {
    try {
        const apiKey = await fetchApiKey();
        if (!apiKey) throw new Error('No API key available');
        
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weather-report').innerHTML = '<p>Error fetching weather data. Please try again later.</p>';
    }
}

function displayWeather(weather) {
    const weatherReport = document.getElementById('weather-report');
    if (weather && weather.weather && weather.weather[0] && weather.main) {
        const iconUrl = `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;
        weatherReport.innerHTML = `
            <h3>${weather.name}</h3>
            <p><img src="${iconUrl}" alt="${weather.weather[0].description}"> ${weather.main.temp}°C</p>
            <p>${weather.weather[0].description}</p>
        `;
    } else {
        weatherReport.innerHTML = '<p>Unable to retrieve weather information at this time.</p>';
    }
}

function getLocationAndWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const weather = await fetchWeather(latitude, longitude);
                displayWeather(weather);
            } catch (error) {
                console.error('Error fetching weather data:', error);
                document.getElementById('weather-report').innerHTML = '<p>Error fetching weather data. Please try again later.</p>';
            }
        }, error => {
            console.error('Error getting geolocation:', error);
            document.getElementById('weather-report').innerHTML = '<p>Unable to retrieve your location. Please ensure location services are enabled and try again.</p>';
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
        document.getElementById('weather-report').innerHTML = '<p>Geolocation is not supported by this browser.</p>';
    }
}

document.addEventListener('DOMContentLoaded', getLocationAndWeather);

document.getElementById('chat-toggle').addEventListener('click', function () {
    const chatBox = document.getElementById('chat-box');
    chatBox.style.display = chatBox.style.display === 'flex' ? 'none' : 'flex';
});

document.getElementById('close-chat').addEventListener('click', function () {
    document.getElementById('chat-box').style.display = 'none';
});
