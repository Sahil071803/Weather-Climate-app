export default function WeatherAlerts({ alerts }) {
  if (!alerts || !alerts.alert || alerts.alert.length === 0) return null;

  return (
    <div className="alerts-container">
      {alerts.alert.map((a, i) => (
        <div key={i} className="alert-banner">
          <div className="alert-header">
            <span className="alert-icon">!</span>
            <span className="alert-headline">{a.headline || a.event || "Weather Alert"}</span>
            <button
              className="alert-close"
              onClick={(e) => e.target.closest(".alert-banner").remove()}
            >
              x
            </button>
          </div>
          {a.desc && <p className="alert-desc">{a.desc}</p>}
          <div className="alert-meta">
            {a.effective && <span>From: {new Date(a.effective).toLocaleString()}</span>}
            {a.expires && <span>Until: {new Date(a.expires).toLocaleString()}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
