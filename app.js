const apiKey = "7404528d20dc1170845bf2a784210ad7"; // Your OpenWeatherMap API Key

// Function to fetch the user's current location
function fetchCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        displayCurrentLocationWeather(data);
      } catch (error) {
        console.error("Error fetching location weather:", error);
        document.getElementById('currentLocation').textContent = "Error fetching weather data.";
      }
    });
  } else {
    document.getElementById('currentLocation').textContent = "Geolocation not supported.";
  }
}

// Display the current location's weather
function displayCurrentLocationWeather(data) {
  const locationDiv = document.getElementById('currentLocation');
  locationDiv.innerHTML = `
    <strong>Current Location:</strong><br>
    ${data.name}, ${data.sys.country}<br>
    Temperature: ${data.main.temp}°C
  `;
}

// Function to get city name suggestions based on user input
async function getCitySuggestions() {
  const input = document.getElementById('cityInput').value;
  const suggestionsBox = document.getElementById('suggestions');

  if (input.length > 2) {
    const url = `https://api.openweathermap.org/data/2.5/find?q=${input}&appid=${apiKey}&type=like&units=metric`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();

      suggestionsBox.innerHTML = ''; // Clear previous suggestions

      if (data.list && data.list.length > 0) {
        data.list.forEach(city => {
          const suggestionItem = document.createElement('li');
          suggestionItem.textContent = `${city.name}, ${city.sys.country}`;
          suggestionItem.onclick = () => {
            document.getElementById('cityInput').value = suggestionItem.textContent;
            suggestionsBox.innerHTML = ''; // Clear suggestions after selection
          };
          suggestionsBox.appendChild(suggestionItem);
        });
      } else {
        suggestionsBox.innerHTML = '<li>No suggestions found</li>';
      }
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    }
  } else {
    suggestionsBox.innerHTML = ''; // Clear suggestions when input is too short
  }
}

// Function to fetch weather data based on city input
async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  const errorMessage = document.getElementById("errorMessage");
  errorMessage.textContent = "";  // Clear previous error message

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found!");
    const data = await response.json();

    document.getElementById("weather").innerHTML = `
      <h3>Weather in ${data.name}</h3>
      <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
      <p><strong>Condition:</strong> ${data.weather[0].main}</p>
      <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
    `;
  } catch (error) {
    document.getElementById("weather").innerHTML = "";
    errorMessage.textContent = error.message;
  }
}

// Call function to fetch current location on page load
fetchCurrentLocation();