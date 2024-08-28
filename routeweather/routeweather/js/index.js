// Constants for day and month names
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Function to fetch weather data and update the display
async function search(location) {
    try {
        // Fetch weather data from the API
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=7d77b96c972b4d119a3151101212704&q=${location}&days=3`);

        // Check if the response is successful and not a bad request
        if (!response.ok || response.status === 400) return;

        // Parse the JSON response
        const data = await response.json();

        // Update the display with current weather and forecast
        displayCurrent(data.location, data.current);
        displayAnother(data.forecast.forecastday);
    } catch (error) {
        // Handle errors, if any
        console.error("An error occurred:", error);
    }
}

// Function to display current weather
function displayCurrent(location, currentWeather) {
    if (!currentWeather) return;

    // Get the last updated date
    const lastUpdated = new Date(currentWeather.last_updated.replace(" ", "T"));

    // Create HTML for today's forecast
    const todayForecast = `
        <div class="today forecast">
            <div class="forecast-header" id="today">
                <div class="day">${days[lastUpdated.getDay()]}</div>
                <div class="date">${lastUpdated.getDate()} ${monthNames[lastUpdated.getMonth()]}</div>
            </div>
            <div class="forecast-content" id="current">
                <div class="location">${location.name}</div>
                <div class="degree">
                    <div class="num">${currentWeather.temp_c}<sup>o</sup>C</div>
                    <div class="forecast-icon">
                        <img src="https:${currentWeather.condition.icon}" alt="" width="90">
                    </div>
                </div>
                <div class="custom">${currentWeather.condition.text}</div>
                <span><img src="images/icon-umberella.png" alt="">20%</span>
                <span><img src="images/icon-wind.png" alt="">18km/h</span>
                <span><img src="images/icon-compass.png" alt="">East</span>
            </div>
        </div>`;

    // Update the HTML element with the forecast
    document.getElementById("forecast").innerHTML = todayForecast;
}

// Function to display future weather forecasts
function displayAnother(forecastData) {
    let forecastHTML = "";

    // Loop through forecast data and create HTML for each forecast
    for (let i = 1; i < forecastData.length; i++) {
        const forecastDay = new Date(forecastData[i].date.replace(" ", "T"));
        forecastHTML += `
            <div class="forecast">
                <div class="forecast-header">
                    <div class="day">${days[forecastDay.getDay()]}</div>
                </div>
                <div class="forecast-content">
                    <div class="forecast-icon">
                        <img src="https:${forecastData[i].day.condition.icon}" alt="" width="48">
                    </div>
                    <div class="degree">${forecastData[i].day.maxtemp_c}<sup>o</sup>C</div>
                    <small>${forecastData[i].day.mintemp_c}<sup>o</sup></small>
                    <div class="custom">${forecastData[i].day.condition.text}</div>
                </div>
            </div>`;
    }

    // Append the forecast HTML to the existing content
    document.getElementById("forecast").innerHTML += forecastHTML;
}

// Event listener for the search input
document.getElementById("search").addEventListener("keyup", (event) => {
    // Trigger a search when the user types in the search input
    search(event.target.value);
});

// Initial search for Cairo
search("cairo");
