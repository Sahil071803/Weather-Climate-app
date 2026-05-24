export default function Header({ unit, darkMode, onToggleUnit, onToggleTheme }) {
  return (
    <header className="header">
      <div className="header-inner">
        <h1 className="logo">Weather</h1>
        <div className="header-controls">
          <button className="btn btn-sm" onClick={onToggleUnit}>
            {unit === "c" ? "°C / °F" : "°F / °C"}
          </button>
          <button className="btn btn-sm" onClick={onToggleTheme}>
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </div>
    </header>
  );
}
