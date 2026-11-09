import { ImageSourcePropType } from "react-native";

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

interface ForecastData {
  city: { name: string; timezone: number };
  list: ForecastItem[];
}

export interface DailyForecast {
  day: string;
  highF: number;
  lowF: number;
  description: string;
  weatherIcon: ImageSourcePropType;
}

export interface Place {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

export interface LocationInfo {
  state: string,
  country: string
}

export async function getLocationInfo(lat: number, lon: number): Promise<LocationInfo>{
  try{
    const url = `https://geo.fcc.gov/api/census/area?lat=${lat}&lon=${lon}&format=json`;
    const response = await fetch(url);
    if(!response.ok) return { state: "", country: "" };

    const data = await response.json();
    const result = data.results?.[0];
    return {
      state: result?.state_name ?? "",
      country: result?.country_name ?? "",
    };
  }
  catch{
    return { state: "", country: "" };
  }

}

export async function searchPlaces(query: string): Promise<Place[]> {
  const url =
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${api}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to search places");
  return (await response.json()) as Place[];
}

const api = process.env.EXPO_PUBLIC_WEATHER_KEY;

export async function getWeather(city: string, lat?: string, lon?: string): Promise<WeatherInfo>{
  if(!city.trim()) throw new Error ("Please enter in a city");

  const where = lat && lon
    ? `lat=${lat}&lon=${lon}`
    : `q=${encodeURIComponent(city)}`;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?${where}&appid=${api}`;
  const response = await fetch(apiUrl);

  if (!response.ok)throw new Error("Failed to fetch weather data");

  const data = await response.json() as WeatherData;

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

export async function getForecast(city: string, lat?: string, lon?: string): Promise<DailyForecast[]>{
  if(!city.trim()) throw new Error ("Please enter in a city");

    const where = lat && lon
    ? `lat=${lat}&lon=${lon}`
    : `q=${encodeURIComponent(city)}`;
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?${where}&appid=${api}`;
  const response = await fetch(apiUrl);

  if (!response.ok)throw new Error("Failed to fetch weather data");

  const data = await response.json() as ForecastData;
  const tz = data.city.timezone;

  const days = new Map<string, ForecastItem[]>();

  for(const item of data.list){
    const key = new Date((item.dt + tz) * 1000).toISOString().slice(0, 10);
    days.set(key, [...(days.get(key) ?? []), item]);
  }

  return [...days.entries()].slice(0, 6).map(([key, items]) => {
    const midday = items.reduce((best, cur) => {
      const hr = (i: ForecastItem) => new Date((i.dt + tz) * 1000).getUTCHours();
      return Math.abs(hr(cur) - 12) < Math.abs(hr(best) - 12) ? cur : best;
    });

    return {
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

export function convertKelvinToCelcius(temperatureK: number){
  return temperatureK - 273;
}

 function convertoFahrenheit(temperatureK: number){
  let temperatureC = convertKelvinToCelcius(temperatureK);
  return Math.round(temperatureC * (9 / 5) + 32); 
}

export function convertToCelsius(temperatureF: number){
  return Math.round(((temperatureF - 32) * 5) / 9);
}

export function convertToMph(ms: number) {
  return Math.round(ms * 2.23694);
}

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