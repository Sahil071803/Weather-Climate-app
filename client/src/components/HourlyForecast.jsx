function getHour(timeStr) {
  const parts = timeStr.split(" ");
  return parts[1] ? parts[1].substring(0, 5) : timeStr;
}

function TempChart({ hours, formatTemp, unit }) {
  if (hours.length < 2) return null;
  const temps = hours.map((h) => h.temp_c);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const range = max - min || 1;
  const W = 300;
  const H = 80;
  const pad = { top: 10, bottom: 20, left: 30, right: 30 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const stepX = chartW / (hours.length - 1);

  const line = hours.map((h, i) => {
    const x = pad.left + i * stepX;
    const y = pad.top + chartH - ((h.temp_c - min) / range) * chartH;
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");

  const circles = hours.filter((_, i) => i % Math.max(1, Math.floor(hours.length / 6)) === 0 || i === hours.length - 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxHeight: 80, marginTop: 8 }}>
      <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {circles.map((h, i) => {
        const idx = hours.indexOf(h);
        const x = pad.left + idx * stepX;
        const y = pad.top + chartH - ((h.temp_c - min) / range) * chartH;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="3" fill="var(--accent)" stroke="var(--card-bg)" strokeWidth="1.5" />
            <text x={x} y={H - 4} textAnchor="middle" fill="var(--text-muted)" fontSize="8">
              {getHour(h.time)}
            </text>
            <text x={x} y={y - 6} textAnchor="middle" fill="var(--text-muted)" fontSize="8">
              {formatTemp(h.temp_c)}{"\u00B0"}
            </text>
          </g>
        );
      })}
      <text x="4" y={pad.top + 8} fill="var(--text-muted)" fontSize="8">{formatTemp(max)}{"\u00B0"}</text>
      <text x="4" y={pad.top + chartH} fill="var(--text-muted)" fontSize="8">{formatTemp(min)}{"\u00B0"}</text>
    </svg>
  );
}

export default function HourlyForecast({ data, formatTemp, unit }) {
  const hours = data.forecast.forecastday[0].hour;
  const now = new Date(data.location.localtime);
  const currentHour = now.getHours();
  const nextHours = hours.filter((h) => new Date(h.time).getHours() >= currentHour).slice(0, 24);

  if (nextHours.length === 0) return null;

  return (
    <section className="card forecast-section">
      <h3 className="section-title">Hourly Forecast</h3>
      <TempChart hours={nextHours} formatTemp={formatTemp} unit={unit} />
      <div className="hourly-scroll" style={{ marginTop: 12 }}>
        {nextHours.map((h) => (
          <div key={h.time} className="hourly-item">
            <div className="hourly-time">{getHour(h.time)}</div>
            <img
              className="hourly-icon"
              src={`https:${h.condition.icon}`}
              alt={h.condition.text}
              width="32"
              height="32"
            />
            <div className="hourly-temp">{formatTemp(h.temp_c)}{"\u00B0"}</div>
            {h.chance_of_rain > 0 && (
              <div className="hourly-rain">{h.chance_of_rain}%</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
