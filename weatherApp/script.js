async function getWeather() {
  alert("Button Clicked!");

  const city = document.getElementById("cityInput").value;
  const apiKey = "b119a35f6673fec7184fa568df681be3";

  if (city === "") {
    alert("Please enter a city name!");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      alert("City not found!");
      return;
    }

    const data = await response.json();

    document.getElementById("weatherCard").style.display = "block";
    document.getElementById("cityName").innerText = `${data.name}, ${data.sys.country}`;
    document.getElementById("temp").innerText = `🌡 Temperature: ${data.main.temp} °C`;
    document.getElementById("weather").innerText = `☁ Weather: ${data.weather[0].description}`;
    document.getElementById("humidity").innerText = `💧 Humidity: ${data.main.humidity}%`;
    document.getElementById("wind").innerText = `💨 Wind Speed: ${data.wind.speed} m/s`;

  } catch (error) {
    alert("Error fetching data! Check internet or API key.");
  }
}
