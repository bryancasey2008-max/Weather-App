import * as SQLite from "expo-sqlite";
import { Place } from "@/weather";

export interface SavedCity {
  id: number;
  name: string;
  state: string | null;
  country: string;
  lat: number;
  lon: number;
}

const initDB = SQLite.openDatabaseAsync("weather.db").then(async (db) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS saved_cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      state TEXT,
      country TEXT NOT NULL,
      lat REAL NOT NULL,
      lon REAL NOT NULL,
      UNIQUE (lat, lon)
    );
  `);
  return db;
});

export async function getSavedCities(): Promise<SavedCity[]> {
  const db = await initDB;
  return db.getAllAsync<SavedCity>("SELECT * FROM saved_cities ORDER BY id DESC");
}

export async function saveCity(p: Place) {
  const db = await initDB;
  await db.runAsync(
    "INSERT OR IGNORE INTO saved_cities (name, state, country, lat, lon) VALUES (?, ?, ?, ?, ?)",
    [p.name, p.state ?? null, p.country, p.lat, p.lon]
  );
}

export async function removeCity(id: number) {
  const db = await initDB;
  await db.runAsync("DELETE FROM saved_cities WHERE id = ?", [id]);
}