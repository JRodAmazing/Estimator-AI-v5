import fs from "fs-extra";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const SUPPLIER_API = process.env.SUPPLIER_API_URL;
const DATA_PATH = "./data/suppliers.json";

export async function fetchSupplierData() {
  try {
    const res = await fetch(SUPPLIER_API, {
      headers: { Authorization: `Bearer ${process.env.SUPPLIER_API_KEY}` },
    });
    const data = await res.json();
    await fs.writeJson(DATA_PATH, data, { spaces: 2 });
    console.log(`[SYNC] Supplier data updated: ${data.length} records`);
    return data;
  } catch (err) {
    console.error("[SYNC ERROR]", err.message || err);
    return null;
  }
}
