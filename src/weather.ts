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
}

export interface WeatherInfo {
  city: string;
  tempF: number;
  highF: number;
  lowF: number;
  humidity: number;
  description: string;
  id: number;
  weatherEmoji: string;
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
  weatherEmoji: string;
}

const api = process.env.EXPO_PUBLIC_WEATHER_KEY;

export async function getWeather(city: string): Promise<WeatherInfo>{
  if(!city.trim()){
    alert("Please enter in a city");
  }

  const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + api;
  const response = await fetch(apiUrl);

  if (!response.ok){
    throw new Error("Failed to fetch weather data");
  }

  const data = await response.json() as WeatherData;

    return {
    city: data.name,
    tempF: convertoFahrenheit(data.main.temp),
    highF: convertoFahrenheit(data.main.temp_max),
    lowF: convertoFahrenheit(data.main.temp_min),
    humidity: data.main.humidity,
    description: data.weather[0].description,
    id: data.weather[0].id,
    weatherEmoji:  getWeatherEmoji(data.weather[0].id)
  };
}

export async function getForecast(city: string): Promise<DailyForecast[]>{
  if(!city.trim()) throw new Error ("Please enter in a city");

  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${api}`;
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
      weatherEmoji: getWeatherEmoji(midday.weather[0].id),
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

function getWeatherEmoji(id: number){
  switch(true){
    case (id >= 200 && id < 300):
      return "⛈️";
    case (id >= 300 && id < 400):
      return "🌧️";
    case (id >= 500 && id < 600):
      return "🌧️";
    case (id >= 600 && id < 700):
      return "❄️";
    case (id >= 700 && id < 800):
      return "🌫️";
    case (id === 800):
      return "☀️";
    case (id >= 801 && id < 810):
      return "☁️";
    default:
      return "?"
  }
}