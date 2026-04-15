import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🌤️ Icon Function
  const getIcon = (condition) => {
    if (condition.includes("Cloud")) return "☁️";
    if (condition.includes("Rain")) return "🌧️";
    if (condition.includes("Clear")) return "☀️";
    if (condition.includes("Snow")) return "❄️";
    return "🌤️";
  };

  // 🕒 Time Format Function (IMPORTANT FIX)
  const formatTime = (time) =>
    new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // 🌈 Background Function
  const getBackground = () => {
    if (!weather) return "#0f172a";

    const condition = weather.weather[0].main;

    if (condition.includes("Cloud")) return "#64748b";
    if (condition.includes("Rain")) return "#5575cc";
    if (condition.includes("Clear")) return "#0ea5e9";
    if (condition.includes("Snow")) return "#94a3b8";

    return "#0f172a";
  };

  // 🌍 API CALL
  const getWeather = async () => {
    setLoading(true);

    const apiKey = "d87e06c21fbb91bde733b9774c09a5f2";

    try {
      // Current Weather
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();
      setWeather(data);

      // Forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      const forecastData = await forecastRes.json();
      setForecast(forecastData);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <div
      className="container"
      style={{ background: getBackground(), minHeight: "100vh" }}
    >
      <h1>Weather App 🌦️</h1>

      <input
        type="text"
        placeholder="Enter city (e.g. Karachi, London)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button onClick={getWeather}>Search</button>

      {loading && <p>Loading weather... ⏳</p>}

      {/* CURRENT WEATHER */}
      {weather?.main && (
        <div className="card">
          <h2>{weather.name}</h2>
          <h1>{weather.main.temp}°C</h1>

          <h3>
            {getIcon(weather.weather[0].main)}{" "}
            {weather.weather[0].main}
          </h3>
        </div>
      )}

      {/* FORECAST */}
      {forecast && (
        <div className="forecast-container">
          <h3>Next 3-Hour Forecast</h3>

          <div className="forecast-grid">
            {forecast.list.slice(0, 8).map((item, index) => (
              <div className="forecast-card" key={index}>
                <p>{formatTime(item.dt_txt)}</p>
                <h4>{item.main.temp}°C</h4>
                <p>{getIcon(item.weather[0].main)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;