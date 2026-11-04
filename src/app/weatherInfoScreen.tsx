import { styles } from "@/styles";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { getWeather, WeatherInfo } from "@/weather";


export default function WeatherInfoScreen() {
  const { city } = useLocalSearchParams<{ city: string }>();
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getWeather(city)
    .then(setWeather)
    .catch((e) => setError(e.message));
  }, [city])
  
  if(error) return <Text>Error</Text>
  if(!weather) return <ActivityIndicator/ >

  return (
    <View style = {styles.weatherInfo}>
      <Text style = {styles.city}>{weather.city}</Text>
      <Text style = {styles.temperature}>{weather.tempF}°F {weather.weatherEmoji}</Text>
      <Text style = {styles.humidity}>Humidity: {weather.humidity}</Text>
      <Text style = {styles.desc}>{weather.description}</Text>
    </View>
  );
}


