const apiKey = "87a993043f82e640348a28e2d004f4d9";
const weatherDisplay = document.getElementById("weatherDisplay");
const errorDisplay = document.getElementById("errorDisplay");
const locationInput = document.getElementById("locationInput");
const getWeatherBtn = document.getElementById("getWeatherBtn");
const unitToggle = document.getElementById("unitToggle");
let unit = "metric"; // Default to Celsius

// Function to fetch weather data from the API using the Fetch API
function getWeather(location, unit) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&appid=${apiKey}`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Location not found. Please check your input.");
      }
    })
    .then((data) => {
      const weatherInfo = `
          <h2>Weather in ${data.name}, ${data.sys.country}</h2>
          <p>Temperature: ${data.main.temp}°${unit === "metric" ? "C" : "F"}</p>
          <p>Humidity: ${data.main.humidity}%</p>
          <p>Wind Speed: ${data.wind.speed} m/s</p>
          <p>Description: ${data.weather[0].description}</p>
        `;
      weatherDisplay.innerHTML = weatherInfo;
      errorDisplay.innerHTML = "";
    })
    .catch((error) => {
      showError(error.message);
    });
}

// Function to display errors
function showError(message) {
  errorDisplay.innerHTML = `<p>Error: ${message}</p>`;
  weatherDisplay.innerHTML = "";
}

// Event listener for the "Get Weather" button
getWeatherBtn.addEventListener("click", () => {
  const location = locationInput.value.trim();
  if (location) {
    getWeather(location, unit);
  }
});

// Event listener for unit toggle
unitToggle.addEventListener("change", (e) => {
  unit = e.target.value;
  const location = locationInput.value.trim();
  if (location) {
    getWeather(location, unit);
  }
});

// Optional: Geolocation
function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`
        )
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("An error occurred while fetching data.");
            }
          })
          .then((data) => {
            const location = `${data.name}, ${data.sys.country}`;
            getWeather(location, unit);
          })
          .catch((error) => {
            showError(error.message);
          });
      },
      () => showError("Geolocation permission denied.")
    );
  } else {
    showError("Geolocation is not supported by your browser.");
  }
}

// Call the geolocation function when the page loads
getLocationWeather();

// Event listener for the "Get Weather" button
getWeatherBtn.addEventListener("click", () => {
  const location = locationInput.value.trim();
  if (location) {
    getWeather(location, unit);
    errorDisplay.innerHTML = ""; // Clear any previous error messages
  } else {
    showError("Please enter a location.");
  }
});
