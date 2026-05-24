export default function Chips({ recent, favorites, onSelect, onRemove }) {
  const all = [...new Set([...favorites, ...recent])];
  if (all.length === 0) return null;

  return (
    <div className="chips-container">
      {all.map((city) => {
        const isFav = favorites.includes(city);
        return (
          <span
            key={city}
            className={`chip${isFav ? " chip-fav" : ""}`}
            onClick={() => onSelect(city)}
          >
            {isFav ? "\u2605" : "\u2606"} {city}
            <span
              className="chip-remove"
              onClick={(e) => { e.stopPropagation(); onRemove(city); }}
            >
              x
            </span>
          </span>
        );
      })}
    </div>
  );
}
