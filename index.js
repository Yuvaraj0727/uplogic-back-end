const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());

// 1. email verification api
app.get("/verify-email", async (req, res) => {
  const { email } = req.query;
  console.log(`verifying email: ${email}`)
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const response = await fetch(
      `http://apilayer.net/api/check?access_key=${process.env.MAILBOXLAYER_API_KEY}&email=${email}&smtp=1&format=1`
    );

    const data = await response.json()
    console.log(data);
    res.json(data)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to verify email" });
  }
});


// 2.1. Weather by Coordinates api
app.get("/api/weather/location", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon)
    return res.status(400).json({ error: "Missing coordinates" });

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch weather by location" });
  }
});

// 2.2. Weather by City api
app.get("/api/weather/city", async (req, res) => {
  const { city } = req.query;

  if (!city) return res.status(400).json({ error: "City name required" });

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch weather by city" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
