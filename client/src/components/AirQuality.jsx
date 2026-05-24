function getAQILevel(pm25) {
  if (pm25 <= 12) return { label: "Good", color: "#27ae60" };
  if (pm25 <= 35) return { label: "Moderate", color: "#f39c12" };
  if (pm25 <= 55) return { label: "Unhealthy for Sensitive Groups", color: "#e67e22" };
  if (pm25 <= 150) return { label: "Unhealthy", color: "#e74c3c" };
  if (pm25 <= 250) return { label: "Very Unhealthy", color: "#8e44ad" };
  return { label: "Hazardous", color: "#641e16" };
}

export default function AirQuality({ data }) {
  if (!data.air_quality) {
    return (
      <section className="card forecast-section">
        <h3 className="section-title">Air Quality Index</h3>
        <p className="text-muted">Air quality data not available</p>
      </section>
    );
  }

  const pm25 = data.air_quality.pm2_5;
  const level = getAQILevel(pm25);
  const pct = Math.min((pm25 / 250) * 100, 100);

  const pollutants = [
    { label: "PM2.5", value: pm25 },
    { label: "PM10", value: data.air_quality.pm10 },
    { label: "O3", value: data.air_quality.o3 },
    { label: "NO2", value: data.air_quality.no2 },
    { label: "SO2", value: data.air_quality.so2 },
    { label: "CO", value: data.air_quality.co },
  ];

  return (
    <section className="card forecast-section">
      <h3 className="section-title">Air Quality Index</h3>
      <div className="aqi-display">
        <div className="aqi-value" style={{ color: level.color }}>
          {pm25.toFixed(1)}
        </div>
        <div className="aqi-label" style={{ color: level.color }}>
          {level.label}
        </div>
        <div className="aqi-bar-container">
          <div className="aqi-bar" style={{ width: `${pct}%`, background: level.color }} />
        </div>
        <div className="aqi-details">
          {pollutants.map((p) => (
            <div key={p.label} className="aqi-detail-item">
              <span className="aqi-detail-label">{p.label}</span>
              <span className="aqi-detail-value">
                {p.value ? p.value.toFixed(1) : "N/A"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
