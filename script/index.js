const searchBtn = document.getElementById("search");
const cityInput = document.getElementById("cityInput");
const climateFutureReport = document.querySelector(".future-weather-cards");
const currentWeatherDiv = document.querySelector(".current-weather-div");
const locationImg = document.getElementById("location-img");
const unitValue = document.getElementById("selectUnit");
const bgHome = document.querySelector(".bg-home");

const defaultButton = document.getElementById("defaultButton");

const cityName = document.getElementById("cityName");
const dateCity = document.getElementById("dateCity");
const weatherDesc = document.getElementById("weatherDesc");
const temp = document.getElementById("temp");
const weatherImage = document.getElementById("weatherImage");
const humidityData = document.getElementById("humidityData");
const visibility = document.getElementById("visibility");
const windData = document.getElementById("windData");
const pressureData = document.getElementById("pressureData");

const myPlot = document.getElementById("myPlot");
const myPlot1 = document.getElementById("myPlot1");

const apiKey = "1e9f9472dc3f7eca9971884e1026b402";

// Get the user's email from the URL parameter
const urlParams = new URLSearchParams(window.location.search);
const userEmail = urlParams.get("email");

//Declaring the empty array
let xArray = [];
let yArray = [];

let aArray = [];
let bArray = [];

let yMax, yMin;
let bMax, bMin;

//Alert the user with message
function showAlert(message, className) {
  const div = document.createElement("div");
  div.className = `alert alert-${className} w-md-50 py-2 py-md-0 ms-md-auto fw-bold mb-0 py-0 d-flex align-items-center justify-content-center`;
  div.appendChild(document.createTextNode(message));

  const msgContainer = document.querySelector(".msgContainer");
  const defaultDiv = document.getElementById("defaultDiv");

  msgContainer.insertBefore(div, defaultDiv);

  setTimeout(() => {
    document.querySelector(".alert").remove();
  }, 5000);
}


const getCoordinates = () => {
  xArray = [];
  yArray = [];

  aArray = [];
  bArray = [];
  const cityInputVal = cityInput.value.trim();
  if (cityInputVal == ""){
    return showAlert("Please Enter your city name", "danger");
  }
  let modifiedCityName = cityInputVal;
  if (cityInputVal.toLowerCase() === "canada") {
    modifiedCityName = "Ottawa";
  } else if (cityInputVal.toLowerCase() === "china") {
    modifiedCityName = "Beijing";
  } else if (cityInputVal.toLowerCase() === "qatar") {
    modifiedCityName = "Doha";
  }

  const geoCodingApi = `http://api.openweathermap.org/geo/1.0/direct?q=${modifiedCityName}&limit=1&appid=${apiKey}`;

  //Getting the latitude and longitude for the entered city name from direct geocoding API
  fetch(geoCodingApi)
    .then((res) => res.json())
    .then((data) => {
      const { name, lat, lon } = data[0];
      console.log(name, lat, lon);

      getWeatherReport(name, lat, lon);
    })
    .catch(() => {
      showAlert("Error Occured while fetching", "danger");
    });
};

function getWeatherReport(cityInputVal, lat, lon) {
  const unitVal = unitValue.value;
  let units = unitVal == "metric" ? "°C" : "°F";
  let windUnit = unitVal == "metric" ? "m/s" : "mph";
 

//fetching the weather data from the API using lattitude and longitude

const futureForecastAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unitVal}`;

  fetch(futureForecastAPI)
    .then((res) => {
      res.json()
    })
    .then((data) => {
      const uniqueDate = [];
      
      console.log(data);
      const dataList = data.list;
      let futureForecast = dataList.filter((forecast) => { 
        let foreCastDate = new Date(forecast.dt_txt).getDate();
        defaultButton.innerHTML = 'change'; 
        if (!uniqueDate.includes(foreCastDate)) {
          return uniqueDate.push(foreCastDate);
        }
      });
      console.log(futureForecast);
      //clearing previous data
      climateFutureReport.innerHTML = " ";

      //displaying weather forecast
      futureForecast.forEach((weatherItem, index) => {
        if (index === 0) {
          getDisplayWeather(cityInputVal, units, windUnit, weatherItem, index);
        } else {
          climateFutureReport.insertAdjacentHTML(
            "beforeend",
            getDisplayWeather(cityInputVal, units, windUnit, weatherItem, index)
          );
        }
      });
    })
    .catch(() => {
      showAlert("Error occured while fetching the weather forcast", "danger");
    });
}
function getDisplayWeather(cityInputVal, units, windUnit, weatherItem, index) {

  let d = new Date(weatherItem.dt_txt.split(" ")[0]);
  console.log(d)
  d = d.toString();
  d = d.split(" ");
  console.log(d);


  //Setting background image and weather image based on condition
  let imageSrc;
  if (weatherItem.weather[0].main == "Clouds") {
    if (index == 0) {
      bgHome.style.backgroundImage = "url('./image/cloud-bg.jpg')";
      bgHome.style.backgroundPosition = "left";
    }
    imageSrc = "./image/clouds.png";
  } else if (weatherItem.weather[0].main == "Clear") {
    if (index == 0) {
      bgHome.style.backgroundImage = "url('./image/sunny-bg.jpg')";
      bgHome.style.backgroundPosition = "left";
    }
    imageSrc = "./image/clear.png";
  } else if (weatherItem.weather[0].main == "Drizzle") {
    if (index == 0) {
      bgHome.style.backgroundImage = "url('./image/rain-bg.jpg')";
      bgHome.style.backgroundPosition = "bottom";
    }
    imageSrc = "./image/drizzle.png";
  } else if (weatherItem.weather[0].main == "Rain") {
    if (index == 0) {
      bgHome.style.backgroundImage = "url('./image/rain-bg.jpg')";
      bgHome.style.backgroundPosition = "bottom";
    }
    imageSrc = "./image/rain.png";
  } else if (weatherItem.weather[0].main == "Mist") {
    if (index == 0) {
      bgHome.style.backgroundImage = "url('./image/mist-bg.jpg')";
      bgHome.style.backgroundPosition = "left";
    }
    imageSrc = "./image/mist.png";
  } else if (
    weatherItem.weather[0].main == "Smoke" ||
    weatherItem.weather[0].main == "Snow"
  ) {
    if (index == 0) {
      bgHome.style.backgroundImage = "url('./image/snow-bg2.jpg')";
      bgHome.style.backgroundPosition = "bottom";
    }
    imageSrc = "./image/snow.png";
  }
//Line graph of temperature and humidity
  xArray.push(d[0]);
  yArray.push(weatherItem.main.temp);


  yMax = Math.max(...yArray);
  yMin = Math.min(...yArray);

  // Define Data
  const data = [
    {
      x: xArray,
      y: yArray,
      mode: "lines",
      marker: { color: "white" },
    },
  ];

  // Define Layout
  const layout = {
    height: 350,
    width: 350,
    font: {
      color: "white",
      family: "Poppins",
    },
    paper_bgcolor: "rgba(36, 94, 154,0.6)",
    plot_bgcolor: "rgba(36, 94, 154,0.1)",

    xaxis: { title: "Days" },
    yaxis: { range: [yMin, yMax], title: "Temp °C/°F" },
    title: "Temperature",
  };

  // Display using Plotly
  Plotly.newPlot("myPlot", data, layout);
  
  aArray.push(d[0]);
  bArray.push(weatherItem.main.humidity);

  bMax = Math.max(...bArray);
  bMin = Math.min(...bArray);
  // Define Data
  const data1 = [
    {
      x: aArray,
      y: bArray,
      mode: "lines",
      marker: { color: "white" },
    },
  ];

  // Define Layout
  const layout1 = {
    height: 350,
    width: 350,
    font: {
      color: "white",
      family: "Poppins",
    },
    paper_bgcolor: "rgba(36, 94, 154,0.6)",
    plot_bgcolor: "rgba(36, 94, 154,0.1)",

    xaxis: { title: "Days" },
    yaxis: { range: [bMin, bMax], title: "Humidity %" },
    title: "Humidity",
  };

  Plotly.newPlot("myPlot1", data1, layout1);

  let description = weatherItem.weather[0].description;
  description = description.charAt(0).toUpperCase() + description.substr(1);

  //Displaying weather forecast
  if (index === 0) {
    console.log("entered");
    cityName.innerHTML = cityInputVal.toUpperCase();
    dateCity.innerHTML = `${d[0]}, ${d[2]} ${d[1]}`;
    weatherDesc.innerHTML = description;
    temp.innerHTML = `${Math.round(
      weatherItem.main.temp
    )}<sup class=" font-20">${units}</sup>`;
    weatherImage.src = imageSrc;
    humidityData.innerHTML = weatherItem.main.humidity + "%";
    visibility.innerHTML = weatherItem.visibility + "m";
    windData.innerHTML = weatherItem.wind.speed + windUnit;
    pressureData.innerHTML = weatherItem.main.pressure + "hPa";
  } else {
    return `<div class="col-md-3 card p-3 ms-1 me-2 mb-2"style="box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 3px 2px;">
            
            <div class='row'>
                <div class='col-6'>
                  <p class="dateCity text-center">${d[0]}, ${d[2]} ${d[1]}</p>
                  <img src=${imageSrc} class="cityImage mx-auto d-inline-block" width="100">
                  </div>
                <div class="px-2 col-6 d-flex flex-column justify-content-center">
                  <p class="lead  d-flex justify-content-evenly align-items-center"><i class="fa-sharp fa-solid fa-temperature-three-quarters fa-lg" ></i> ${Math.round(
      weatherItem.main.temp
    )}${units}</p>
                  <p class="lead  d-flex justify-content-evenly align-items-center"><i class="fa-sharp fa-solid fa-water fa-lg" ></i> ${weatherItem.main.humidity
      }%</p>
                  <p class="lead  d-flex justify-content-evenly ms-md-2 align-items-center mb-0"><i class="fa-sharp fa-solid fa-wind fa-lg"></i> ${weatherItem.wind.speed.toFixed(
        1
      )}${windUnit}</p>
                </div>
            </div>
            </div>`;
  }
}

console.log(aArray);
console.log(bArray);

//Getting User coordinates with the help of navigator geo location
const getUserCoordinates = () => {
  locationImg.style.opacity = "0.6";
  xArray = [];
  yArray = [];

  aArray = [];
  bArray = [];
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log(position);
      const { latitude, longitude } = position.coords;

//Getting City Name from the user location with the help of reverse geocoding API 
      const getcityName_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
      fetch(getcityName_URL)
        .then((res) => res.json())
        .then((data) => {
          const { name, lat, lon } = data[0];
          cityInput.value = name;
          getWeatherReport(name, lat, lon);
        })
        .catch((error) => showAlert(error, "danger"));
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        showAlert(error.message, "danger");
      }
    }
  );
};


locationImg.addEventListener("click", getUserCoordinates);
searchBtn.addEventListener("click", getCoordinates);
cityInput.addEventListener("keyup",(e) => e.key === "Enter" && getCoordinates());
unitValue.addEventListener("change", getCoordinates);
cityInput.addEventListener("click", () => {
  cityInput.value = "";
});

// Store the user's email in local storage for future use
defaultButton.addEventListener("click", () => {
  let cityInputVal = cityInput.value.trim();
  if (cityInputVal == "")
    return showAlert("Please Enter your city name", "danger");


  if (cityInputVal.toLowerCase() === "canada") {
    cityInputVal = "Ottawa";
  } else if (cityInputVal.toLowerCase() === "china") {
    cityInputVal = "Beijing";
  } else if (cityInputVal.toLowerCase() === "qatar") {
    cityInputVal = "Doha";
  }

  const geoCodingApi = `http://api.openweathermap.org/geo/1.0/direct?q=${cityInputVal}&limit=1&appid=${apiKey}`;

  //Getting the latitude and longitude for the entered city name from direct geocoding API
  fetch(geoCodingApi)
    .then((res) => res.json())
    .then((data) => {
      if (data.length == 0)
        return showAlert(`No coordinates found for ${cityInputVal}`, danger);
      const { name, lat, lon } = data[0];
      console.log(name, lat, lon);

      let storedData = [];
      storedData.push(name, lat, lon);
      localStorage.setItem(`${userEmail}`, JSON.stringify(storedData));
      showAlert(`Default location is set as ${name}`, 'info');
  
    })
    .catch(() => {
      showAlert("Error Occured while setting the default location", "danger");
    });
 
});

//Getting the user's data from the local storage
function getDefaultLocation() {
  storedData = localStorage.getItem(`${userEmail}`);
  if (storedData) {
    const storedDataParsed = JSON.parse(storedData);
    console.log(storedDataParsed);
    const storedCity = storedDataParsed[0];
    const storedLat = storedDataParsed[1];
    const storedLon = storedDataParsed[2];
    return { city: storedCity, lat: storedLat, lon: storedLon };
  } else {
    return { city: "Pernampattu", lat: 12.9366728, lon: 78.7187469 }; // Default location
  }
}

// Set the default location when the page loads
window.addEventListener("load", () => {
  const { city, lat, lon } = getDefaultLocation();
  cityInput.value = city;
  getWeatherReport(city, lat, lon);
});

//scroll card script for future weather forecast
let scrollcards = document.querySelector(".scroll-cards");
const rightAngle = document.querySelector(".right-angle");
const leftAngle = document.querySelector(".left-angle");


scrollcards.addEventListener("wheel", (e) => {
  e.preventDefault();
  console.log(e.deltaY);
  scrollcards.style.scrollBehavior = "smooth";
  scrollcards.scrollLeft += e.deltaY;
});

rightAngle.addEventListener("click", () => {
  scrollcards.style.scrollBehavior = "smooth";
  scrollcards.scrollLeft += 900;
});

leftAngle.addEventListener("click", () => {
  scrollcards.style.scrollBehavior = "smooth";
  scrollcards.scrollLeft -= 900;
});
