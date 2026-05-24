import { useEffect, useState, useRef, useCallback } from "react";
import useWeather from "./hooks/useWeather.js";
import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import Chips from "./components/Chips.jsx";
import CurrentWeather from "./components/CurrentWeather.jsx";
import WeatherDetails from "./components/WeatherDetails.jsx";
import HourlyForecast from "./components/HourlyForecast.jsx";
import DailyForecast from "./components/DailyForecast.jsx";
import AirQuality from "./components/AirQuality.jsx";
import WeatherAlerts from "./components/WeatherAlerts.jsx";
import "./App.css";

export default function App() {
  const {
    weatherData, loading, error, unit, darkMode, recent, favorites, lastUpdated,
    fetchWeather, searchCities, toggleUnit, toggleTheme, toggleFavorite, removeRecent, formatTemp,
  } = useWeather();

  const [autocomplete, setAutocomplete] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [query, setQuery] = useState("");
  const [initialLoad, setInitialLoad] = useState(true);
  const [showShortcutHint, setShowShortcutHint] = useState(true);
  const debounceRef = useRef(null);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const contentRef = useRef(null);
  const shortcutTimerRef = useRef(null);

  useEffect(() => {
    fetchWeather("Delhi");
    const timer = setTimeout(() => setShowShortcutHint(false), 6000);
    shortcutTimerRef.current = timer;
    return () => clearTimeout(timer);
  }, [fetchWeather]);

  useEffect(() => {
    if (weatherData && initialLoad) setInitialLoad(false);
  }, [weatherData, initialLoad]);

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
        setShowAutocomplete(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (weatherData && !loading) {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [weatherData, loading]);

  const handleInput = useCallback((value) => {
    setQuery(value);
    clearTimeout(debounceRef.current);
    if (value.length < 2) {
      setAutocomplete([]);
      setShowAutocomplete(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const results = await searchCities(value);
      setAutocomplete(results.slice(0, 5));
      setShowAutocomplete(results.length > 0);
    }, 300);
  }, [searchCities]);

  const handleSearch = useCallback((q) => {
    const term = q || query;
    if (!term.trim()) return;
    setQuery(term);
    setShowAutocomplete(false);
    setShowShortcutHint(false);
    fetchWeather(term);
  }, [query, fetchWeather]);

  const handleSelectCity = useCallback((name) => {
    setQuery(name);
    setShowAutocomplete(false);
    setShowShortcutHint(false);
    fetchWeather(name);
  }, [fetchWeather]);

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      fetchWeather("Delhi");
      return;
    }
    setShowShortcutHint(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(`${pos.coords.latitude},${pos.coords.longitude}`),
      () => fetchWeather("Delhi"),
      { timeout: 10000 }
    );
  }, [fetchWeather]);

  const isFav = weatherData && favorites.includes(weatherData.location.name);

  return (
    <div className="app">
      <Header unit={unit} darkMode={darkMode} onToggleUnit={toggleUnit} onToggleTheme={toggleTheme} />

      <main className="main">
        <div className="search-container" ref={searchRef}>
          <SearchBar
            query={query}
            inputRef={inputRef}
            onInput={handleInput}
            onSearch={handleSearch}
            onGeolocate={handleGeolocate}
          />
          {showShortcutHint && (
            <p className="shortcut-hint">Press <kbd>/</kbd> to search</p>
          )}
          {showAutocomplete && (
            <div className="autocomplete">
              {autocomplete.map((item) => (
                <div
                  key={item.id || item.name}
                  className="autocomplete-item"
                  onClick={() => handleSelectCity(item.name)}
                >
                  {item.name}, {item.region}, {item.country}
                </div>
              ))}
            </div>
          )}
          <Chips
            recent={recent}
            favorites={favorites}
            onSelect={handleSelectCity}
            onRemove={removeRecent}
          />
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner" />
            <p>Fetching weather data...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}

        {weatherData && !loading && (
          <div className="weather-content" ref={contentRef}>
            {weatherData.alerts && <WeatherAlerts alerts={weatherData.alerts} />}
            <CurrentWeather
              data={weatherData}
              unit={unit}
              formatTemp={formatTemp}
              isFav={isFav}
              onToggleFav={() => toggleFavorite(weatherData.location.name)}
              lastUpdated={lastUpdated}
            />
            <WeatherDetails data={weatherData} />
            <HourlyForecast data={weatherData} formatTemp={formatTemp} unit={unit} />
            <DailyForecast data={weatherData} formatTemp={formatTemp} />
            <AirQuality data={weatherData.current} />
          </div>
        )}
      </main>

      <footer className="footer">
        <p className="text-muted">
          Powered by{" "}
          <a href="https://www.weatherapi.com/" target="_blank" rel="noopener">
            WeatherAPI
          </a>
        </p>
      </footer>
    </div>
  );
}
