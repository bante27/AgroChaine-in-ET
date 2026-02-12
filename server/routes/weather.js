import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Handle GET /api/weather?city=Addis Ababa (or lat/lon)
router.get("/", async (req, res) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ Weather API key missing. Returning empty weather data.");
      return res.status(200).json({ success: true, weather: null, message: "Weather service unavailable" });
    }

    const city = req.query.city || "Addis Ababa,ET";
    const lat = req.query.lat;
    const lon = req.query.lon;

    let weatherUrl;
    if (lat && lon) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    } else {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    }

    const response = await axios.get(weatherUrl);

    const weatherData = {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: Math.round(response.data.main.temp),
      feelsLike: Math.round(response.data.main.feels_like),
      condition: response.data.weather[0].main,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      precipitation: response.data.rain ? response.data.rain['1h'] || 0 : 0,
      icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
      updatedAt: new Date().toLocaleString("en-ET", { timeZone: "Africa/Addis_Ababa" }),
    };

    res.status(200).json({ success: true, weather: weatherData });
  } catch (error) {
    console.error("🌧️ Weather fetch error:", error.message);
    res.status(500).json({ success: false, error: "Failed to fetch weather data." });
  }
});

export default router;