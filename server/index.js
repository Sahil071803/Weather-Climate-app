import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.WEATHER_API_KEY;
const API_BASE = "https://api.weatherapi.com/v1";

app.use(cors({
  origin: process.env.ORIGIN || true,
  credentials: true,
}));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.get("/api/weather", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "Query parameter 'q' is required" });
    const url = `${API_BASE}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(q)}&days=3&aqi=yes&alerts=yes`;
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || "Weather API error" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.get("/api/search", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q || q.length < 2) return res.json([]);
    const url = `${API_BASE}/search.json?key=${API_KEY}&q=${encodeURIComponent(q)}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || "Search API error" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to search cities" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
