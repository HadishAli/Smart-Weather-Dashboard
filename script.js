const apiKey = "bd5e378503939ddaee76f12ad7a97608"; // 100% Active Working Key
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const historyList = document.getElementById('historyList');

// Page load hote hi history load karna
document.addEventListener('DOMContentLoaded', displayHistory);

// Button click par handle karna
searchBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Page refresh hone se rokne ke liye
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert("Please enter a city name!");
    }
});

// Input box mein 'Enter' key dabane par bhi search chalega
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) fetchWeather(city);
    }
});

function fetchWeather(city) {
    const url = `https://openweathermap.org{encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    
    const cityNameElement = document.getElementById('cityName');
    const weatherDataBlock = document.getElementById('weatherData');
    
    cityNameElement.innerText = "Searching live server...";
    weatherDataBlock.style.display = "none";

    fetch(url)
        .then(res => { 
            if (!res.ok) {
                throw new Error('City not found');
            } 
            return res.json(); 
        })
        .then(data => {
            cityNameElement.innerText = `📍 ${data.name}, ${data.sys.country}`;
            document.getElementById('temp').innerText = `${Math.round(data.main.temp)}°C`;
            document.getElementById('description').innerText = `Condition: ${data.weather[0].description}`;
            document.getElementById('humidity').innerText = `💧 Humidity: ${data.main.humidity}%`;
            document.getElementById('wind').innerText = `💨 Wind: ${data.wind.speed} km/h`;
            
            weatherDataBlock.style.display = "block";
            saveToHistory(data.name);
        })
        .catch(err => {
            cityNameElement.innerText = "❌ City not found! Please check spelling.";
            weatherDataBlock.style.display = "none";
        });
}

function saveToHistory(cityName) {
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    if (!history.includes(cityName)) {
        history.unshift(cityName);
        if (history.length > 5) history.pop();
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
