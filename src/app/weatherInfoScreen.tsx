import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { styles } from "@/styles";
import { getForecast, DailyForecast, WeatherInfo, getWeather, convertToCelsius } from "@/weather";
import { Dropdown } from 'react-native-element-dropdown';

type Unit = "F" | "C"

const unitOptions: {label: string, value: Unit}[] = [
  {label: "Fahrenheit (°F)", value: "F"},
  {label: "Celsius (°C)", value: "C"}
];

export default function WeatherInfoScreen() {
  const { city } = useLocalSearchParams<{ city: string }>();
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const[unit, setUnit] = useState<Unit>("F");

  useEffect(() => {
    async function load() {
      try {
        const [weather, days] = await Promise.all([
          getWeather(city),
          getForecast(city),
        ]);

        setWeather(weather);
        setForecast(days);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [city]);

  const show = (f: number) =>
  unit === "F" ? f : convertToCelsius(f);
  if (loading) return <ActivityIndicator />;
  if (error || !weather) return <Text>{error}</Text>;

  return (
    <FlatList
      data={forecast}
      keyExtractor={(d) => d.day}
      ListHeaderComponent={
        <View style = {styles.weatherInfo}>
          <Text style= { styles.city }>{weather.city}</Text>
          <Text style= { styles.temperature}>{show(weather.tempF)}°{unit} {weather.weatherEmoji}</Text>
          <Text style= { styles.desc }>{weather.description}</Text>
          <Text style = {styles.humidity}>H: {show(weather.highF)}° L: {show(weather.lowF)}° · Humidity: {weather.humidity}%</Text>

          <Dropdown style = {styles.dropdown}
            data={unitOptions}
            labelField="label"
            valueField="value"
            value={unit}
            onChange={(option) => setUnit(option.value)}
          />
        </View>
      }
      renderItem={({ item, index }) => (
        <View style={[
          styles.forecast,
          index === 0 && styles.forecastFirst,
          index === forecast.length - 1 && styles.forecastLast,
      ]}
    >
          <Text style = {styles.forecastText }>{item.day}</Text>
          <Text style = {styles.forecastEmoji}>{item.weatherEmoji}</Text>
          <Text style = {styles.forecastTemp}>{show(item.highF)}° / {show(item.lowF)}°</Text>
        </View>
      )}
    />
  );
}