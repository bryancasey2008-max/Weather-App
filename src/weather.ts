interface WeatherData {
  name: string;
  main: {
    temp: number;
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
  humidity: number;
  description: string;
  id: number;
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
    humidity: data.main.humidity,
    description: data.weather[0].description,
    id: data.weather[0].id,
    weatherEmoji:  getWeatherEmoji(data.weather[0].id)
  };
}

function convertKelvinToCelcius(temperatureK: number){
  return temperatureK - 273;
}

function convertoFahrenheit(temperatureK: number){
  let temperatureC = convertKelvinToCelcius(temperatureK);
  return Math.round(temperatureC * (9 / 5) + 32); 
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