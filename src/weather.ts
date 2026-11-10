import { ImageSourcePropType } from "react-native";

// Define the structure of the weather data returned by the OpenWeatherMap API
interface WeatherData {
  name: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  coord: { lat: number; lon: number };
}

// Define the structure of the weather information that will be returned by the getWeather function
export interface WeatherInfo {
  city: string;
  tempF: number;
  highF: number;
  lowF: number;
  humidity: number;
  description: string;
  id: number;
  weatherIcon: ImageSourcePropType;
  windMph: number;
  lat: number,
  lon: number
}

// Define the structure of the forecast data returned by the OpenWeatherMap API
interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
}

// Define the structure of the forecast data that will be returned by the getForecast function
interface ForecastData {
  city: { name: string; timezone: number };
  list: ForecastItem[];
}

// Define the structure of the daily forecast information that will be returned by the getForecast function
export interface DailyForecast {
  day: string;
  highF: number;
  lowF: number;
  description: string;
  weatherIcon: ImageSourcePropType;
}

// Define the structure of a place that can be searched for using the OpenWeatherMap Geocoding API
export interface Place {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

// Define the structure of the location information that will be returned by the getLocationInfo function
export interface LocationInfo {
  state: string,
  country: string
}

  // Use the FCC API to get the state and country information based on latitude and longitude
export async function getLocationInfo(lat: number, lon: number): Promise<LocationInfo>{
  // Check if the API key is not set, and throw an error in that case
  try{
    // Check if the API key is not set, and throw an error in that case
    if(!api) throw new Error("API key is not set");
    const url = `https://geo.fcc.gov/api/census/area?lat=${lat}&lon=${lon}&format=json`;
    const response = await fetch(url);
    if(!response.ok) return { state: "", country: "" };
    // Parse the response and extract the state and country information
    const data = await response.json(); // The response is expected to have a "results" array with at least one element
    const result = data.results?.[0]; 

    // Return the state and country information, or empty strings if not available
    return {
      state: result?.state_name ?? "",
      country: result?.country_name ?? "",
    };
  }
  catch{
    return { state: "", country: "" };
  }

}

// Function to search for places using the OpenWeatherMap Geocoding API, based on a query string (city name)
export async function searchPlaces(query: string): Promise<Place[]> {
  // Check if the query is empty or if the API key is not set, and throw an error in those cases
  if(!query.trim()) throw new Error("Please enter a city name");
  if(!api) throw new Error("API key is not set");
  const url =
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${api}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to search places");
  return (await response.json()) as Place[];
}

const api = process.env.EXPO_PUBLIC_WEATHER_KEY; // Non-hardcoded API key for security reasons. Make sure to set this in your environment variables.

// Function to get the current weather information for a given city, latitude, and longitude
export async function getWeather(city: string, lat?: string, lon?: string): Promise<WeatherInfo>{
  // Check if the city is empty or if the API key is not set, and throw an error in those cases
  if(!city.trim()) throw new Error ("Please enter in a city");
  if(!api) throw new Error("API key is not set");

  // Construct the query parameters based on whether latitude and longitude are provided or not
  const where = lat && lon
    ? `lat=${lat}&lon=${lon}`
    : `q=${encodeURIComponent(city)}`;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?${where}&appid=${api}`;
  const response = await fetch(apiUrl);

  if (!response.ok)throw new Error("Failed to fetch weather data");

  const data = await response.json() as WeatherData; // Type assertion to ensure the response is treated as WeatherData
    // Return the weather information in the desired format, converting temperatures and wind speed as needed
    return {
    city: data.name,
    tempF: convertoFahrenheit(data.main.temp),
    highF: convertoFahrenheit(data.main.temp_max),
    lowF: convertoFahrenheit(data.main.temp_min),
    humidity: data.main.humidity,
    description: data.weather[0].description,
    id: data.weather[0].id,
    weatherIcon:  getWeatherIcon(data.weather[0].id),
    windMph: convertToMph(data.wind.speed),
    lat: data.coord.lat,
    lon: data.coord.lon
  };
}

// Function to show a 5 day weather forecast for a given city, latitude, and longitude
export async function getForecast(city: string, lat?: string, lon?: string): Promise<DailyForecast[]>{
  // Check if the city is empty or if the API key is not set, and throw an error in those cases
  if(!city.trim()) throw new Error ("Please enter in a city");
  if(!api) throw new Error("API key is not set");
  // Construct the query parameters based on whether latitude and longitude are provided or not
    const where = lat && lon
    ? `lat=${lat}&lon=${lon}`
    : `q=${encodeURIComponent(city)}`;
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?${where}&appid=${api}`; // Use the OpenWeatherMap 5-day forecast API
  const response = await fetch(apiUrl); // Fetch the forecast data from the API

  if (!response.ok)throw new Error("Failed to fetch weather data");

  const data = await response.json() as ForecastData; // Type assertion to ensure the response is treated as ForecastData
  const tz = data.city.timezone; // Get the timezone offset in seconds for the city, which will be used to adjust the timestamps of the forecast items

  const days = new Map<string, ForecastItem[]>(); // Create a map to group forecast items by day, using the date string as the key

  // Iterate over the forecast items and group them by day, adjusting the timestamps based on the timezone offset
  for(const item of data.list){
    const key = new Date((item.dt + tz) * 1000).toISOString().slice(0, 10); // Get the date string in the format "YYYY-MM-DD" for the forecast item, adjusted for the timezone
    days.set(key, [...(days.get(key) ?? []), item]); // Add the forecast item to the array for the corresponding day in the map
  }

  // Return an array of DailyForecast objects for the next 5 days, selecting the forecast item closest to midday for each day
  return [...days.entries()].slice(0, 6).map(([key, items]) => {
    // Find the forecast item closest to midday (12:00 PM) for the day, using the timezone-adjusted timestamps
    // We use a reduce function to iterate over the forecast items and compare their hours to find the one closest to 12 PM
    const midday = items.reduce((best, cur) => { 
      const hr = (i: ForecastItem) => new Date((i.dt + tz) * 1000).getUTCHours(); //  Helper function to get the hour of the forecast item in UTC, adjusted for the timezone
      return Math.abs(hr(cur) - 12) < Math.abs(hr(best) - 12) ? cur : best; // Compare the current item with the best item found so far, and return the one closest to midday
    });

    // Return the DailyForecast object for the day, including the day of the week, high and low temperatures in Fahrenheit, weather description, and weather icon
    return {
      // Convert the date string to a more readable format, showing the short weekday name (e.g., "Mon", "Tue") in the "en-US" locale, using UTC time zone
      day: new Date(key + "T00:00:00Z").toLocaleDateString("en-US", {
        weekday: "short",
        timeZone: "UTC",
      }),
      highF: convertoFahrenheit(Math.max(...items.map(i => i.main.temp_max))),
      lowF: convertoFahrenheit(Math.min(...items.map(i => i.main.temp_min))),
      description: midday.weather[0].description,
      weatherIcon: getWeatherIcon(midday.weather[0].id),
    };
  });
}

// Function to convert temperature from Kelvin to Celsius
export function convertKelvinToCelcius(temperatureK: number){
  return temperatureK - 273;
}

// Function to convert temperature from Kelvin to Fahrenheit
function convertoFahrenheit(temperatureK: number){
  let temperatureC = convertKelvinToCelcius(temperatureK);
  return Math.round(temperatureC * (9 / 5) + 32); 
}

// Function to convert temperature from Fahrenheit to Celsius
export function convertToCelsius(temperatureF: number){
  return Math.round(((temperatureF - 32) * 5) / 9);
}

// Function to convert wind speed from meters per second to miles per hour
export function convertToMph(ms: number) {
  return Math.round(ms * 2.23694);
}

// Function to get the appropriate weather icon based on the weather condition ID
function getWeatherIcon(id: number){
  switch(true){
    case (id >= 200 && id <= 232):
      return require("@/assets/images/WeatherIcons/11d_t.png");
    case (id >= 300 && id <= 321):
      return require("@/assets/images/WeatherIcons/09d_t.png");
    case (id >= 500 && id <= 504):
      return require("@/assets/images/WeatherIcons/10d_t.png");
    case (id === 511):
      return require("@/assets/images/WeatherIcons/13d_t.png");
    case (id >= 520 && id <= 531):
      return require("@/assets/images/WeatherIcons/09d_t.png");
    case (id >= 600 && id <= 622):
      return require("@/assets/images/WeatherIcons/13d_t.png");
    case (id >= 701 && id < 781):
      return require("@/assets/images/WeatherIcons/50d_t.png");
    case (id === 800):
      return require("@/assets/images/WeatherIcons/01d_t.png");
    case (id === 801):
      return require("@/assets/images/WeatherIcons/02d_t.png");
    case (id === 802):
      return require("@/assets/images/WeatherIcons/03d_t.png");
    case (id === 803):
      return require("@/assets/images/WeatherIcons/04d_t.png");
    case (id === 804):
      return require("@/assets/images/WeatherIcons/04d_t.png");
    default:
      return require("@/assets/images/WeatherIcons/01d_t.png");
  }
}