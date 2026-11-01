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

const api = "f36705b128aea29a56989abd4ad8382e";

export async function showWeather(city: string){
  if(city){
    try{
      const weatherData = await getWeather(city);
      displayWeather(weatherData);
    }
    catch(error){
      alert("City not found");
      return;
    }
  }
  else{
    alert("Please enter in a city");
    return;
  }
}

async function getWeather(city: string){
  const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + api;
  const response = await fetch(apiUrl);
  console.log(response);

  if (!response.ok){
    throw new Error("Failed to fetch weather data");
  }

  return await response.json() as WeatherData;
}

function displayWeather(data: WeatherData){
  const {
    name: city, 
    main: {temp, humidity}, 
    weather: [{description, id}],
  } = data;

  alert("City:" + city + ", Temp: " + convertoFahrenheit(temp) + "°F, Humidity: " + humidity + ", Description: " + description + ",  Id: " + id)
}

function convertKelvinToCelcius(temperatureK: number){
  return temperatureK - 273;
}

function convertoFahrenheit(temperatureK: number){
  let temperatureC = convertKelvinToCelcius(temperatureK);
  return Math.round(temperatureC * (9 / 5) + 32); 
}