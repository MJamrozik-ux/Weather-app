
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

async function getForecast() {
    let url = `http://localhost:3000/weather?city=${city}`;
    let response = await fetch(url);

    if (!response.ok) {
        console.log("API error: " + response.status);
        window.location.href = "Starting Page.html";
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