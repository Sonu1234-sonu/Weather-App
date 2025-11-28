const API_KEY = "68614aed2fd63e8f34e9ef55e7d092be";

const elements = {
    cityInput: document.getElementById('city'),
    searchBtn: document.getElementById('searchBtn'),
    unitToggle: document.getElementById('unitToggle'),
    dataCard: document.getElementById('data'),
    status: document.getElementById('status'),
    cityName: document.getElementById('cityName'),
    weatherType: document.getElementById('weatherType'),
    weatherIcon: document.getElementById('weatherIcon'),
    temp: document.getElementById('temp'),
    feelsLike: document.getElementById('feelsLike'),
    windSpeed: document.getElementById('windSpeed'),
    humidity: document.getElementById('humidity'),
    pressure: document.getElementById('pressure')
};

let lastWeatherData = null; // store raw API response

function kelvinToC(k) { return k - 273.15 }
function cToF(c) { return (c * 9 / 5) + 32 }

function showStatus(msg) {
    elements.status.textContent = msg;
}

function showCard(visible) {
    elements.dataCard.style.display = visible ? 'block' : 'none';
}

async function getWeather() {
    const city = elements.cityInput.value.trim();
    if (!city) {
        showStatus('Please enter a city name');
        showCard(false);
        return;
    }

    showStatus('Looking up location...');
    showCard(false);

    try {
        const { lat, lon } = await getGeoLoc(city);
        showStatus('Fetching weather...');

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Weather fetch failed');
        const data = await res.json();
        lastWeatherData = data;
        renderWeather(data);
        showStatus('Updated just now');
        showCard(true);
    } catch (err) {
        console.error(err);
        showStatus('Unable to get weather. Check city name or network.');
        showCard(false);
    }
}

async function getGeoLoc(city) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Geo lookup failed');
    const data = await res.json();
    if (!data || data.length === 0) throw new Error('Location not found');
    const { lat, lon, name, country } = data[0];
    return { lat, lon, name, country };
}

function formatTemp(kelvin) {
    const c = kelvinToC(kelvin);
    if (elements.unitToggle.checked) {
        return `${cToF(c).toFixed(1)}°F`;
    }
    return `${c.toFixed(1)}°C`;
}

function renderWeather(data) {
    elements.cityName.textContent = `${data.name}, ${data.sys && data.sys.country ? data.sys.country : ''}`;
    elements.weatherType.textContent = data.weather[0].description;
    elements.weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    elements.temp.textContent = formatTemp(data.main.temp);
    elements.feelsLike.textContent = formatTemp(data.main.feels_like);
    elements.windSpeed.textContent = `${data.wind.speed} m/s`;
    elements.humidity.textContent = `${data.main.humidity}%`;
    elements.pressure.textContent = `${data.main.pressure} hPa`;
}

// Update displayed temps when unit toggle changes
elements.unitToggle.addEventListener('change', () => {
    if (!lastWeatherData) return;
    elements.temp.textContent = formatTemp(lastWeatherData.main.temp);
    elements.feelsLike.textContent = formatTemp(lastWeatherData.main.feels_like);
});

// Wire up search button and Enter key
elements.searchBtn.addEventListener('click', getWeather);
elements.cityInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') getWeather(); });

// Hide card initially
showCard(false);
