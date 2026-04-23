const API_KEY = "fb1eda3a318bd46aa9091ec92ba73e5c";
let city = localStorage.getItem("city");

function getDayName(dateString) {
    let date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
}

function formatForecastData(data) {
    let days = {};

    for (let i = 0; i < data.list.length; i++) {
        let item = data.list[i];
        let fullDate = item.dt_txt;
        let date = fullDate.split(" ")[0];

        let isNoon = fullDate.indexOf("12:00:00") !== -1;
        let dayAlreadyExists = days[date] !== undefined;

        if (isNoon && !dayAlreadyExists) {
            days[date] = {
                date: date,
                day: getDayName(fullDate),
                temp: Math.round(item.main.temp),
                description: item.weather[0].description,
                icon: item.weather[0].icon
            };
        }
    }

    let result = [];
    let keys = Object.keys(days);

    for (let j = 0; j < keys.length && j < 3; j++) {
        result.push(days[keys[j]]);
    }

    return result;
}

function getWeatherForDate(data, targetDate) {
    let results = [];
    let dates = [];

    let baseDate = new Date(targetDate);

    for (let i = 0; i < 3; i++) {
        let d = new Date(baseDate);
        d.setDate(baseDate.getDate() + i);

        let year = d.getFullYear();
        let month = String(d.getMonth() + 1).padStart(2, "0");
        let day = String(d.getDate()).padStart(2, "0");

        dates.push(`${year}-${month}-${day}`);
    }

    for (let i = 0; i < dates.length; i++) {
        let target = dates[i];
        let foundItem = null;

        for (let j = 0; j < data.list.length; j++) {
            let item = data.list[j];
            let fullDate = item.dt_txt;

            let isSameDate = fullDate.indexOf(target) === 0;
            let isNoon = fullDate.indexOf("12:00:00") !== -1;

            if (isSameDate && isNoon) {
                foundItem = item;
                break;
            }
        }

        if (foundItem === null) {
            results.push(null);
        } else {
            results.push({
                date: target,
                day: getDayName(foundItem.dt_txt),
                temp: Math.round(foundItem.main.temp),
                description: foundItem.weather[0].description,
                icon: foundItem.weather[0].icon
            });
        }
    }

    return results;
}

async function getForecast() {
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=en`;

    let response = await fetch(url);

    if (!response.ok) {
        console.log("API error: " + response.status);
        window.location.href = "Weather-app0.html";
        window.alert("Invalid city")
        return;
    }

    let data = await response.json();

    let forecast = formatForecastData(data);
    for (let i = 1; i < forecast.length; i++) {
        let day = forecast[i];
        let dayNumber = i + 1;
        document.getElementById(`d${dayNumber}n`).textContent = `${day.day}`
        document.getElementById(`d${dayNumber}img`).src = "https://openweathermap.org/img/wn/" + day.icon + ".png";
        
    }
    let details = forecast[0]
    document.getElementById("d1n").textContent = `${details.day}  ${details.date}` 
    document.getElementById("h2").textContent = `${details.temp}°`
    let text = details.description;
    let formattedText = text.charAt(0).toUpperCase() + text.slice(1);
    document.getElementById("h3").textContent = formattedText;
    document.getElementById(`d1img`).src = "https://openweathermap.org/img/wn/" + details.icon + ".png";


}

getForecast();