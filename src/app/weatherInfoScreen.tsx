import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View, Image, TouchableOpacity } from "react-native";
import { useStyles } from "@/styles";
import { getForecast, DailyForecast, WeatherInfo, getWeather, convertToCelsius, getLocationInfo, LocationInfo } from "@/weather";
import { Dropdown } from 'react-native-element-dropdown';
import { AntDesign } from '@expo/vector-icons'; 
import { router } from "expo-router";
import { saveCity } from "@/db";
import { useTheme } from "@/themes";

type Unit = "F" | "C";

const unitOptions: {label: string, value: Unit}[] = [
  {label: "Fahrenheit (°F)", value: "F"},
  {label: "Celsius (°C)", value: "C"}
];

export default function WeatherInfoScreen() {
  const theme = useTheme(); // inside the component, with your other hooks
  const styles = useStyles();
  const { city, state, country, lat, lon } = useLocalSearchParams<{
    city: string;
    state?: string;
    country?: string;
    lat?: string;
    lon?: string;
  }>();
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const[unit, setUnit] = useState<Unit>("F");
  const[location, setLocation] = useState<LocationInfo>();

  useEffect(() => {
    async function load() {
      try {
        const [weather, days] = await Promise.all([
          getWeather(city, lat, lon),
          getForecast(city, lat, lon),
        ]);

        setWeather(weather);
        setForecast(days);
        const resolvedLocation = await getLocationInfo(weather.lat, weather.lon);
        setLocation({
          state: state || resolvedLocation.state,
          country: country || resolvedLocation.country,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [city, country, lat, lon, state]);

  const showTemp = (f: number) =>
  unit === "F" ? f : convertToCelsius(f);

  const showWindSpeed = (mph: number) =>
  unit === "F" ?  `${mph} mph` : `${Math.round(mph * 1.60934)} km/h`;
  if (loading) return <ActivityIndicator />;
  if (error || !weather) return <Text>{error}</Text>;

  return (
    <View style = {styles.container}>
    <FlatList
      data={forecast}
      keyExtractor={(d) => d.day}
      ListHeaderComponent={
        <View style = {styles.weatherInfo}>

          <Text style = {styles.city}>{weather.city} {location?.state && `, ${location.state}`} {location?.country && `, ${location.country}`}</Text>
          <Text style= { styles.temperature }>{showTemp(weather.tempF)}°{unit} <Image source={weather.weatherIcon} style = {styles.forecastIcon}/></Text>
          <Text style= { styles.desc }>{weather.description}</Text>
          <Text style = {styles.humidity }>H: {showTemp(weather.highF)}° L: {showTemp(weather.lowF)}° · Humidity: {weather.humidity}% · Wind: {showWindSpeed(weather.windMph)}</Text>

          <Dropdown style = {styles.dropdown}
            data={unitOptions}
            labelField="label"
            valueField="value"
            value={unit}
            onChange={(option) => setUnit(option.value)}

            selectedTextStyle={{ color: theme.text }}        // the chosen value shown in the closed box
            placeholderStyle={{ color: theme.placeholder }}  // text shown when nothing is selected
            itemTextStyle={{ color: theme.text }}            // each option in the open menu
            containerStyle={{                                // the open menu's box
              backgroundColor: theme.surface,
              borderColor: theme.border,
            }}
            activeColor={theme.divider}                      // highlight behind the selected option
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
          <Text style = {styles.forecastText }>{[ index > 0 && item.day, index === 0 && "Today"]}</Text>
          <Image source={item.weatherIcon} />
          <Text style = {styles.forecastTemp}>{showTemp(item.highF)}° / {showTemp(item.lowF)}°</Text>
        </View>
      )}
    />

    <TouchableOpacity style={styles.homeButton} onPress={() => {
      router.push({ pathname: "/" as any });}}>
      <AntDesign name="home" size={18} color="#fff" />
    </TouchableOpacity>

    <TouchableOpacity style={styles.saveButton}
  onPress={() =>
    saveCity({
      name: city,
      state,
      country: country ?? location?.country ?? "",
      lat: Number(lat),
      lon: Number(lon),
    })
  }
>
  <AntDesign name="star" size={40} color="#fff" />
</TouchableOpacity>
  </View>
  );
}