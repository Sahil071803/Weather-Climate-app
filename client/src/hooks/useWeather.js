import { useState, useCallback, useEffect } from "react";

const LS_KEYS = {
  unit: "weather_unit",
  dark: "weather_dark",
  recent: "weather_recent",
  fav: "weather_fav",
};

function loadArray(key) {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); }
  catch { return []; }
}

export default function useWeather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState(() => localStorage.getItem(LS_KEYS.unit) || "c");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(LS_KEYS.dark) === "true");
  const [recent, setRecent] = useState(() => loadArray(LS_KEYS.recent));
  const [favorites, setFavorites] = useState(() => loadArray(LS_KEYS.fav));
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => { localStorage.setItem(LS_KEYS.unit, unit); }, [unit]);
  useEffect(() => { localStorage.setItem(LS_KEYS.dark, darkMode); }, [darkMode]);
  useEffect(() => { localStorage.setItem(LS_KEYS.recent, JSON.stringify(recent)); }, [recent]);
  useEffect(() => { localStorage.setItem(LS_KEYS.fav, JSON.stringify(favorites)); }, [favorites]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const API_BASE = import.meta.env.VITE_API_URL || "";

  const fetchWeather = useCallback(async (query) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/weather?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Location not found");
      setWeatherData(data);
      setLastUpdated(new Date().toLocaleTimeString());
      setRecent((prev) => [query, ...prev.filter((c) => c !== query)].slice(0, 5));
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCities = useCallback(async (query) => {
    if (query.length < 2) return [];
    try {
      const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }, []);

  const toggleUnit = useCallback(() => {
    setUnit((u) => (u === "c" ? "f" : "c"));
  }, []);

  const toggleTheme = useCallback(() => {
    setDarkMode((d) => !d);
  }, []);

  const toggleFavorite = useCallback((city) => {
    setFavorites((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  }, []);

  const removeRecent = useCallback((city) => {
    setRecent((prev) => prev.filter((c) => c !== city));
    setFavorites((prev) => prev.filter((c) => c !== city));
  }, []);

  const formatTemp = useCallback((celsius) => {
    if (unit === "f") return `${Math.round(celsius * 9 / 5 + 32)}`;
    return `${Math.round(celsius)}`;
  }, [unit]);

  return {
    weatherData,
    loading,
    error,
    unit,
    darkMode,
    recent,
    favorites,
    lastUpdated,
    fetchWeather,
    searchCities,
    toggleUnit,
    toggleTheme,
    toggleFavorite,
    removeRecent,
    formatTemp,
  };
}
