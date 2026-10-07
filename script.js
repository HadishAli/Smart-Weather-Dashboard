const apiKey = "857b607ceea3c7ef6bf3ee2546419747"; // Live Weather Data Key
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const historyList = document.getElementById('historyList');

// Page load hote hi history load karna
document.addEventListener('DOMContentLoaded', displayHistory);

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

function fetchWeather(city) {
    const url = `https://openweathermap.org{encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    document.getElementById('cityName').innerText = "Loading data from live server...";

    fetch(url)
        .then(res => { if (!res.ok) throw new Error('City not found'); return res.json(); })
        .then(data => {
            document.getElementById('cityName').innerText = `📍 ${data.name}, ${data.sys.country}`;
            document.getElementById('temp').innerText = `${Math.round(data.main.temp)}°C`;
            document.getElementById('description').innerText = `Condition: ${data.weather[0].description}`;
            document.getElementById('humidity').innerText = `💧 Humidity: ${data.main.humidity}%`;
            document.getElementById('wind').innerText = `💨 Wind: ${data.wind.speed} km/h`;
            document.getElementById('weatherData').style.display = "block";
            
            saveToHistory(data.name);
        })
        .catch(err => {
            document.getElementById('cityName').innerText = "❌ City not found! Please check spelling.";
            document.getElementById('weatherData').style.display = "none";
        });
}

function saveToHistory(cityName) {
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    if (!history.includes(cityName)) {
        history.unshift(cityName); // Naya city sabse upar add karein
        if (history.length > 5) history.pop(); // Max 5 items rakhein
        localStorage.setItem('weatherHistory', JSON.stringify(history));
        displayHistory();
    }
}

function displayHistory() {
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    if (history.length === 0) {
        historyList.innerHTML = '<li>No recent searches yet.</li>';
        return;
    }
    historyList.innerHTML = history.map(city => `<li>📍 ${city}</li>`).join('');
}

document.getElementById('clearHistoryBtn').addEventListener('click', () => {
    localStorage.removeItem('weatherHistory');
    displayHistory();
});