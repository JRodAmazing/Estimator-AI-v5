// mock-api/server.js
import express from "express";
import fs from "fs";

const app = express();
const PORT = 5055;

// Route to return mock pricing data
app.get("/prices", (req, res) => {
  try {
    const raw = fs.readFileSync("./mock-api/mockData.json", "utf8");
    const data = JSON.parse(raw);
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Unable to read mock data" });
  }
});

app.listen(PORT, () => {
  console.log(`[MOCK API] Listening on http://localhost:${PORT}`);
});

