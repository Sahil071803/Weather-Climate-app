function getDayName(dateStr) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" });
}

export default function DailyForecast({ data, formatTemp }) {
  return (
    <section className="card forecast-section">
      <h3 className="section-title">3-Day Forecast</h3>
      <div className="daily-list">
        {data.forecast.forecastday.map((d) => (
          <div key={d.date} className="daily-item">
            <span className="daily-date">{getDayName(d.date)}</span>
            <div className="daily-condition">
              <img
                src={`https:${d.day.condition.icon}`}
                alt={d.day.condition.text}
                width="28"
                height="28"
              />
              <span>{d.day.condition.text}</span>
            </div>
            <div className="daily-temps">
              <span className="daily-high">{formatTemp(d.day.maxtemp_c)}{"\u00B0"}</span>
              <span className="daily-low">{formatTemp(d.day.mintemp_c)}{"\u00B0"}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
