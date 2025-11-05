import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { listProjects } from "../utils/store.js";
import { optimizeProject } from "../utils/optimizer.js";
import { syncSupplierPrices } from "../utils/supplierSync.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

app.get("/api/projects", (req, res) => {
  const projects = listProjects(100);
  res.json(projects);
});

app.get("/api/optimize/:id", (req, res) => {
  const projects = listProjects(100);
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: "Not found" });
  const result = optimizeProject(project);
  res.json(result);
});

app.get("/api/suppliers/sync", async (req, res) => {
  const region = req.query.region || "TX";
  const updated = await syncSupplierPrices(region);
  res.json({ updated, region });
});

app.listen(PORT, () => console.log(`🌐 Web dashboard running at http://localhost:${PORT}`));
