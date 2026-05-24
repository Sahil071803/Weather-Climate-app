function getFeelsLikeTemp(celsius) {
  if (celsius >= 35) return { label: "Very Hot", color: "#e74c3c" };
  if (celsius >= 30) return { label: "Hot", color: "#e67e22" };
  if (celsius >= 25) return { label: "Warm", color: "#f39c12" };
  if (celsius >= 20) return { label: "Pleasant", color: "#27ae60" };
  if (celsius >= 15) return { label: "Cool", color: "#3498db" };
  if (celsius >= 10) return { label: "Chilly", color: "#2980b9" };
  if (celsius >= 0) return { label: "Cold", color: "#8e44ad" };
  return { label: "Freezing", color: "#641e16" };
}

export default function CurrentWeather({ data, unit, formatTemp, isFav, onToggleFav, lastUpdated }) {
  const loc = data.location;
  const cur = data.current;
  const today = data.forecast.forecastday[0].day;
  const feels = getFeelsLikeTemp(cur.feelslike_c);

  return (
    <section className="card current-weather">
      <div className="weather-header">
        <div>
          <h2>{loc.name}, {loc.region}, {loc.country}</h2>
          <p className="text-muted">
            {new Date(loc.localtime).toLocaleDateString("en-US", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </p>
          <p className="text-muted" style={{ fontSize: "0.75rem" }}>
            Local time: {new Date(loc.localtime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <button
          className={`btn-fav${isFav ? " active" : ""}`}
          onClick={onToggleFav}
          title={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          {isFav ? "\u2605" : "\u2606"}
        </button>
      </div>
      <div className="weather-main">
        <div className="temp-group">
          <span className="temp-value">{formatTemp(cur.temp_c)}</span>
          <span className="temp-unit">{unit === "c" ? "\u00B0C" : "\u00B0F"}</span>
          <p className="text-muted" style={{ marginTop: 4 }}>
            H: {formatTemp(today.maxtemp_c)}{"\u00B0"} L: {formatTemp(today.mintemp_c)}{"\u00B0"}
          </p>
          <p className="text-muted" style={{ marginTop: 2 }}>
            Feels like {formatTemp(cur.feelslike_c)}{"\u00B0"}{" "}
            <span style={{ color: feels.color, fontWeight: 600, fontSize: "0.8rem" }}>
              ({feels.label})
            </span>
          </p>
          {lastUpdated && (
            <p className="text-muted" style={{ fontSize: "0.7rem", marginTop: 6 }}>
              Updated: {lastUpdated}
            </p>
          )}
        </div>
        <div className="condition-group">
          <img
            src={`https:${cur.condition.icon}`}
            alt={cur.condition.text}
            width="64"
            height="64"
          />
          <p className="condition-text">{cur.condition.text}</p>
        </div>
      </div>
    </section>
  );
}
