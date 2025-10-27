const OW_API_KEY = "<YOUR_API_KEY>";
const CURRENT_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST5_ENDPOINT = "https://api.openweathermap.org/data/2.5/forecast";
const ICON_ENDPOINT = "https://openweathermap.org/img/wn/{iconCode}@2x.png";

const getEndpointUrl = function(endpoint, query) {
    const url = new URL(endpoint);

    url.searchParams.append("q", query);
    url.searchParams.append("appid", OW_API_KEY);
    url.searchParams.append("lang", "pl");
    url.searchParams.append("units", "metric");

    return url.toString();
}

const getIconUrl = (iconCode) => ICON_ENDPOINT.replace("{iconCode}", iconCode);

const parseInput = function(input) {
    const date = new Date(input.dt * 1000);

    const formattedDate = date.toLocaleDateString('en-GB').replace(/\//g, '.');
    const formattedTime = date.toLocaleTimeString('en-GB', { hour12: false });

    return {
        date: formattedDate,
        time: formattedTime,
        temperature: input.main.temp + " \u{2103}",
        feelsLike: input.main.feels_like + " \u{2103}",
        pressure: input.main.pressure + " hPa",
        humidity: input.main.humidity + "%",
        windSpeed: input.wind.speed + " m/s",
        description: input.weather[0].description,
        iconCode: input.weather[0].icon
    };
}

const createWeatherBlock = function(weatherData) {
    const createDivWithClass = function(className, parent = null) {
        const div = document.createElement("div");
        div.className = className;
        if (parent) {
            parent.appendChild(div);
        }
        return div;
    }

    const createStat = function(parent, label, value) {
        const item = createDivWithClass("stat-item", parent);

        const labelEl = createDivWithClass("stat-label", item);
        const valueEl = createDivWithClass("stat-value", item);

        labelEl.innerText = label;
        valueEl.innerText = value;

        return item;
    }

    const block = createDivWithClass("weather-block");

    const dateTime = createDivWithClass("date-time", block);
    const weatherDate = createDivWithClass("weather-date", dateTime);
    weatherDate.innerText = weatherData.date;
    const weatherTime = createDivWithClass("weather-time", dateTime);
    weatherTime.innerText = weatherData.time;
    
    const weatherIcon = createDivWithClass("weather-icon", block);
    const iconImg = document.createElement("img");
    iconImg.src = getIconUrl(weatherData.iconCode);
    iconImg.alt = "weather icon";
    weatherIcon.appendChild(iconImg);

    const weatherTemp = createDivWithClass("weather-temp", block);
    weatherTemp.innerText = weatherData.temperature;
    const weatherDesc = createDivWithClass("weather-desc", block);
    weatherDesc.innerText = weatherData.description;

    const stats = createDivWithClass("weather-stats", block);
    
    createStat(stats, "Odczuwalna", weatherData.feelsLike);
    createStat(stats, "Wilgotność", weatherData.humidity);
    createStat(stats, "Wiatr", weatherData.windSpeed);
    createStat(stats, "Ciśnienie", weatherData.pressure);

    return block;
}

let currentWeather = null;
let forecast = null;
let error = null;

const redraw = function() {
    const weatherDisplay = document.getElementById("weather-display");
    const errorDisplay = document.getElementById("error-display");

    weatherDisplay.innerHTML = "";

    if (error) {
        weatherDisplay.classList.add("hidden");
        errorDisplay.classList.remove("hidden");
        errorDisplay.innerText = error;

        return;
    }

    errorDisplay.classList.add("hidden");
    weatherDisplay.classList.remove("hidden");

    if (currentWeather) {
        const currentBlock = createWeatherBlock(currentWeather);
        weatherDisplay.appendChild(currentBlock);    
    }
    if (forecast) {
        for (let i = 0; i < forecast.length; i++) {
            const block = createWeatherBlock(forecast[i]);
            weatherDisplay.appendChild(block);
        }
    }
}

const fetchCurrentWeather = function(query) {
    const url = getEndpointUrl(CURRENT_ENDPOINT, query);

    let req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.addEventListener("load", () => {
        if (req.status === 200) {
            try {
                let output = JSON.parse(req.responseText);
                console.log(output);
                currentWeather = parseInput(output);
            } catch (error) {
                console.error("Error parsing response:", error);
                error = "Wystąpił nieoczekiwany błąd";
            }
        } else if (req.status === 404) {
            error = "Nie znaleziono lokalizacji";
        } else {
            error = "Wystąpił nieoczekiwany błąd";
        }
        redraw();
    });
    
    req.addEventListener("error", () => {
        error = "Wystąpił nieoczekiwany błąd";
        redraw();
    });
    
    req.send();
}

const fetchForecast = function(query) {
    const url = getEndpointUrl(FORECAST5_ENDPOINT, query);
    fetch(url).then((response) => {
        if (response.status === 404) {
            throw new Error("Nie znaleziono lokalizacji");
        } else if (!response.ok) {
            throw new Error("Wystąpił nieoczekiwany błąd");
        }
        return response.json();
    }).then((data) => {
        console.log(data);
        forecast = data.list.map((w) => parseInput(w));
        redraw();
    }).catch((error) => {
        if (error.message === "Nie znaleziono lokalizacji" || error.message === "Wystąpił nieoczekiwany błąd") {
            error = error.message;
        } else {
            error = "Wystąpił nieoczekiwany błąd";
        }
        console.error("Fetch error:", error);
        redraw();
    });
}

document.getElementById("checkButton").addEventListener("click", (event) => {
    event.preventDefault();

    const input = document.getElementById("locationInput");
    const query = input.value;

    if (!query || query.trim().length === 0) {
        alert("Please enter location");
        return;
    }
    
    error = null;

    fetchCurrentWeather(query);
    fetchForecast(query);
})