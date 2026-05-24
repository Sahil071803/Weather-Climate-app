function getWindDirection(deg) {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

function getMoonPhase(phase) {
  const map = {
    "New Moon": "New Moon",
    "Waxing Crescent": "Waxing Crescent",
    "First Quarter": "First Quarter",
    "Waxing Gibbous": "Waxing Gibbous",
    "Full Moon": "Full Moon",
    "Waning Gibbous": "Waning Gibbous",
    "Last Quarter": "Last Quarter",
    "Waning Crescent": "Waning Crescent",
  };
  return map[phase] || phase || "--";
}

export default function WeatherDetails({ data }) {
  const cur = data.current;
  const astro = data.forecast.forecastday[0].astro;

  const items = [
    { label: "Humidity", value: `${cur.humidity}%` },
    { label: "Wind", value: `${cur.wind_kph} km/h` },
    { label: "UV Index", value: cur.uv },
    { label: "Visibility", value: `${cur.vis_km} km` },
    { label: "Pressure", value: `${cur.pressure_mb} mb` },
    { label: "Sunrise", value: astro.sunrise },
    { label: "Sunset", value: astro.sunset },
    { label: "Wind Dir", value: getWindDirection(cur.wind_degree) },
    { label: "Moon", value: getMoonPhase(astro.moon_phase) },
    { label: "Moonrise", value: astro.moonrise || "--" },
    { label: "Moonset", value: astro.moonset || "--" },
    { label: "Gusts", value: `${cur.gust_kph || 0} km/h` },
  ];

  return (
    <section className="card details-section">
      <h3 className="section-title">Weather Details</h3>
      <div className="details-grid">
        {items.map((item) => (
          <div key={item.label} className="detail-item">
            <span className="detail-label">{item.label}</span>
            <span className="detail-value">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
