var apiKey = "e5576d82579ed9bbb612520ba4f08b10";

var input = document.querySelector("input");

var searchBtn = document.querySelector("#searchBtn");

searchBtn.addEventListener("click", getCurrentConditions);

function getCurrentConditions(event) {
    if (event) {
    event.preventDefault();
    }

    var city = input.value;

    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

    fetch(apiUrl)
      .then(function (response) {
          if (response.ok) {
              console.log(response);
              response.json().then(function (data) {
                console.log(data);
                displayCurrentConditions(data);
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

    addSearchHistory(data.name);

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

    console.log(+currentUV.textContent <= 2);

    if (+currentUV.textContent <= 2) {
        currentUV.setAttribute("class", "lowUV");
    } else if (+currentUV.textContent <= 5 && +currentUV.textContent >= 3) {
        currentUV.setAttribute("class", "moderateUV");
    } else if (+currentUV.textContent <= 7 && +currentUV.textContent > 5) {
        currentUV.setAttribute("class", "highUV");
    } else {
        currentUV.setAttribute("class", "veryHighUV");
    }
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

var searchList = document.querySelector("#search-list");


function addSearchHistory(cityName) {
    
    if (JSON.parse(localStorage.getItem("searches")) == null) {

        var searchArray = [];

        if (searchArray.indexOf(cityName) === -1) {
            searchArray.push(cityName);
        }

        var searchBtn = document.createElement("button");
        searchBtn.setAttribute("class", "btn");
        searchBtn.textContent = cityName;
        searchList.prepend(searchBtn);

        localStorage.setItem("searches", JSON.stringify(searchArray));

    } else {
        var searchArray = JSON.parse(localStorage.getItem("searches"));

        if (searchArray.indexOf(cityName) === -1) {
        searchArray.push(cityName);
        }

        var searchBtn = document.createElement("button");
        searchBtn.setAttribute("class", "btn");
        searchBtn.textContent = cityName;
        searchList.prepend(searchBtn);

        localStorage.setItem("searches", JSON.stringify(searchArray));
        
    }

}


var searchArray = JSON.parse(localStorage.getItem("searches"));



if (searchArray !== null) {

for (var i = 0; i < searchArray.length; i++) {

    var searchBtn = document.createElement("button");
    searchBtn.textContent = searchArray[i];
    searchBtn.setAttribute("class", "btn");
    searchList.prepend(searchBtn);

}
}

var searchBtn = searchList.children;

//console.log(searchBtn.length);

//console.log(searchBtn);

//console.log(searchArray);

//console.log(searchArray.indexOf("Culiacan") === -1);

searchList.addEventListener("click", function(event) {

    if (event.target.matches(".btn")) {
    console.log(event.target.textContent);
    input.value = event.target.textContent;
    }

    getCurrentConditions();

   event.target.remove();
})

