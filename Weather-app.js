const API_KEY = "fb1eda3a318bd46aa9091ec92ba73e5c";
let city = "Krakow";

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
        return;
    }

    let data = await response.json();

    let forecast = formatForecastData(data);
    console.log("3 days:", forecast);

    if (forecast.length > 0) {
        let exampleDate = forecast[0].date;
        let singleDay = getWeatherForDate(data, "2026-04-26");
        console.log("Targetdate:", singleDay);
    }
}

getForecast();