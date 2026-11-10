import * as SQLite from "expo-sqlite";
import { Place } from "@/weather";

// Define an interface for a saved city, which includes properties such as id, name, state, country, latitude, and longitude
export interface SavedCity {
  id: number;
  name: string;
  state: string | null;
  country: string;
  lat: number;
  lon: number;
}

// Initialize the SQLite database and create the saved_cities table if it doesn't already exist, with columns for id, name, state, country, latitude, and longitude
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

// Function to retrieve all saved cities from the database, ordered by id in descending order
export async function getSavedCities(): Promise<SavedCity[]> {
  const db = await initDB;
  return db.getAllAsync<SavedCity>("SELECT * FROM saved_cities ORDER BY id DESC");
}

// Function to save a new city to the database, using the provided Place object, and ensuring that duplicate entries based on latitude and longitude are ignored
export async function saveCity(p: Place) {
  const db = await initDB;
  await db.runAsync(
    "INSERT OR IGNORE INTO saved_cities (name, state, country, lat, lon) VALUES (?, ?, ?, ?, ?)",
    [p.name, p.state ?? null, p.country, p.lat, p.lon]
  );
}

// Function to remove a saved city from the database based on its id, allowing users to delete cities they no longer want to keep
export async function removeCity(id: number) {
  const db = await initDB;
  await db.runAsync("DELETE FROM saved_cities WHERE id = ?", [id]);
}