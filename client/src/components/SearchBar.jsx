export default function SearchBar({ query, inputRef, onInput, onSearch, onGeolocate }) {
  return (
    <div className="search-bar">
      <input
        ref={inputRef}
        type="text"
        placeholder='Enter city name... (press "/" to focus)'
        value={query}
        onChange={(e) => onInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        autoComplete="off"
      />
      <button className="btn btn-primary" onClick={() => onSearch()}>
        Search
      </button>
      <button className="btn btn-secondary" onClick={onGeolocate} title="Use my location">
        My Location
      </button>
    </div>
  );
}
