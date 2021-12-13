var searchListArray = JSON.parse(localStorage.getItem("searches"));

var searchList = document.querySelector("#search-list");

console.log(searchListArray);

if (searchListArray !== null) {

for (var i = 0; i < searchListArray.length; i++) {

    var listBtn = document.createElement("button");
    listBtn.textContent = searchListArray[i];
    listBtn.setAttribute("class", "btn");
    searchList.appendChild(listBtn);
}
}

var apiKey = "e5576d82579ed9bbb612520ba4f08b10";

var input = document.querySelector("input");

var searchBtn = document.querySelector("#searchBtn");

searchBtn.addEventListener("click", getCurrentConditions);

function getCurrentConditions(event) {
    event.preventDefault();

    var city = input.value;

    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

    fetch(apiUrl)
      .then(function (response) {
          if (response.ok) {
              console.log(response);
              response.json().then(function (data) {
                console.log(data);
                displayCurrentConditions(data);
                addSearchHistory(city);
              });
          } else {
              alert("Error: " + response.statusText + ". Please search for a valid city name");
          }
      })
      .catch(function (error) {
          alert("Unable to connect to OpenWeather");
      });
};

var cityName = document.querySelector("#city");
var currentTemp = document.querySelector("#currentTemp");
var currentWind = document.querySelector("#currentWind");
var currentHum = document.querySelector("#currentHum");

function displayCurrentConditions(data) {
    console.log(data.name);
    cityName.textContent = data.name;
    input.value = "";

    var date = document.createElement("span");

    date.textContent = moment().format(" (M/D/YYYY)");
    cityName.appendChild(date);

    currentTemp.textContent = data.main.temp + "°F";
    currentWind.textContent = data.wind.speed + " MPH";
    currentHum.textContent = data.main.humidity + "%";

    var cityLon = data.coord.lon;
    var cityLat = data.coord.lat;

    console.log(cityLon);
    console.log(cityLat);

    getCurrentUV(cityLon, cityLat);
    getFutureConditions(cityLon, cityLat);
}

function getCurrentUV (cityLon, cityLat) {

    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly,daily,alerts&appid=" + apiKey;

    fetch(apiUrl)
      .then(function (response) {
          if (response.ok) {
              response.json().then(function (data) {
                  displayCurrentUV(data);
              });
          } else {
              alert("Error " + response.statusText);
          }
      })
      .catch(function (error) {
          alert("Unable to connect to OpenWeather");
      });

};

var currentUV = document.querySelector("#currentUV");

function displayCurrentUV(data) {

    currentUV.textContent = data.current.uvi;

}

function getFutureConditions(cityLon, cityLat) {

    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&units=imperial&exclude=current,minutely,hourly,alerts&appid=" + apiKey;

    fetch(apiUrl)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayFutureConditions(data);
            });
        } else {
            alert("Error " + response.statusText);
        }
    })
    .catch(function (error) {
        alert("Unable to connect to OpenWeather");
    });


}

var futureTemp = document.querySelectorAll(".futureTemp");
var futureWind = document.querySelectorAll(".futureWind");
var futureHum = document.querySelectorAll(".futureHum");

var futureTime = document.querySelectorAll(".futureTime");


function displayFutureConditions(data) {

    for (var i = 0; i < 5; i++) {

    futureTemp[i].textContent = data.daily[i + 1].temp.max + "°F";
    futureWind[i].textContent = data.daily[i + 1].wind_speed + " MPH";
    futureHum[i].textContent = data.daily[i + 1].humidity + "%";

    futureTime[i].textContent = moment().add(i + 1, "days").format("M/D/YYYY");
    }
}

var searchArray = [];

function addSearchHistory(city) {

    var historyBtn = document.createElement("button");
    searchList.appendChild(historyBtn);
    historyBtn.setAttribute("class", "btn");
    historyBtn.textContent = city;

    searchArray.push(city);
    localStorage.setItem("searches", JSON.stringify(searchArray));
}