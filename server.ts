import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Future Impact Twin API is running" });
  });

  // Simple scoring logic endpoint
  app.post("/api/calculate-impact", (req, res) => {
    const data = req.body;
    
    // Basic scoring logic for the demo
    let carbonScore = 50;
    let wasteScore = 50;
    let energyScore = 50;

    // Transport
    if (data.transportType === 'walking' || data.transportType === 'bike') carbonScore += 20;
    else if (data.transportType === 'public_transport') carbonScore += 10;
    else carbonScore -= 10;

    // Diet
    if (data.dietType === 'vegan') carbonScore += 15;
    else if (data.dietType === 'vegetarian') carbonScore += 10;
    else carbonScore -= 5;

    // Energy
    if (data.electricityUsage < 200) energyScore += 20;
    else if (data.electricityUsage < 500) energyScore += 10;
    else energyScore -= 10;

    // Plastic
    if (data.plasticUsage === 'low') wasteScore += 20;
    else if (data.plasticUsage === 'medium') wasteScore += 10;
    else wasteScore -= 10;

    // Travel
    if (data.travelFrequency === 0) carbonScore += 10;
    else if (data.travelFrequency > 3) carbonScore -= 20;

    const sustainabilityScore = Math.min(100, Math.max(0, (carbonScore + wasteScore + energyScore) / 3));

    res.json({
      carbonScore: Math.min(100, Math.max(0, carbonScore)),
      wasteScore: Math.min(100, Math.max(0, wasteScore)),
      energyScore: Math.min(100, Math.max(0, energyScore)),
      sustainabilityScore: Math.round(sustainabilityScore)
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
