const API_KEY = "68614aed2fd63e8f34e9ef55e7d092be";
async function getWeather() {
    const city = document.getElementById("city").value.trim();
    document.getElementById("data").style.display = "none";
    document.getElementById("cityName").innerText = city;
    const { lat, lon } = await getGeoLoc(city);

    console.log(lat, lon);
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    const response = await fetch(URL);
    const data = await response.json();
    document.getElementById("temp").innerText = (data.main.temp - 273.15).toFixed(2) + "℃";
    document.getElementById("windSpeed").innerText = data.wind.speed + "m/s";
    document.getElementById("weatherType").innerText = data.weather[0].description;
    document.getElementById("weatherIcon").src = ` https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    document.getElementById("data").style.display = "block";
}
async function getGeoLoc(city) {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    const response = await fetch(url);
    const data = await response.json();
    let lat = data[0].lat;
    let lon = data[0].lon;
    return { lat, lon };
}