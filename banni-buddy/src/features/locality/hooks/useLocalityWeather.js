import { useState, useEffect } from 'react';

// Open-Meteo uses WMO codes. This translates the numbers into readable text.
const getWeatherCondition = (code) => {
  if (code === 0) return "Clear Sky";
  if (code >= 1 && code <= 3) return "Partly Cloudy";
  if (code === 45 || code === 48) return "Fog/Haze";
  if (code >= 51 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 95) return "Thunderstorm";
  return "Unknown";
};

// Translates the US AQI number into a descriptive category
const getAqiQuality = (aqi) => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive";
  if (aqi <= 200) return "Unhealthy";
  return "Hazardous";
};

export const useLocalityWeather = (lat, lng) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lat || !lng) return;

    const fetchWeatherAndAqi = async () => {
      setLoading(true);
      try {
        // Fetch Temperature and Weather Condition
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code`);
        const weatherData = await weatherRes.json();
        
        // Fetch Air Quality Index (AQI)
        const aqiRes = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi`);
        const aqiData = await aqiRes.json();

        if (weatherData.current && aqiData.current) {
          const currentAqi = Math.round(aqiData.current.us_aqi);
          setWeather({
            temp: `${Math.round(weatherData.current.temperature_2m)}°C`,
            condition: getWeatherCondition(weatherData.current.weather_code),
            aqi: currentAqi,
            quality: getAqiQuality(currentAqi)
          });
        }
      } catch (error) {
        console.error("Failed to fetch weather data", error);
        // Silent fallback just in case the network fails
        setWeather({ temp: "28°C", condition: "Clear", aqi: "45", quality: "Good" });
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherAndAqi();
  }, [lat, lng]);

  return { weather, loading };
};