import { saveCity } from "@/savedCities";
import { useStyles } from "@/styles";
import { useTheme } from "@/themes";
import { convertToCelsius, DailyForecast, getForecast, getLocationInfo, getWeather, LocationInfo, WeatherInfo } from "@/weather";
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Appearance, FlatList, Image, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';

type Unit = "F" | "C"; // Define a type for temperature units, either Fahrenheit (F) or Celsius (C)

// Define the options for the temperature unit dropdown, with labels and corresponding values
const unitOptions: {label: string, value: Unit}[] = [
  {label: "Fahrenheit (°F)", value: "F"},
  {label: "Celsius (°C)", value: "C"}
];

export default function WeatherInfoScreen() {
  const theme = useTheme();
  const styles = useStyles();
  const scheme = useColorScheme();

  // Retrieve the search parameters from the URL, which include city, state, country, latitude, and longitude
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
    // Load the weather information and forecast for the specified city, latitude, and longitude when the component mounts or when any of these parameters change
    async function load() {
      try {
        // Fetch the current weather and forecast data concurrently using Promise.all
        const [weather, days] = await Promise.all([
          getWeather(city, lat, lon),
          getForecast(city, lat, lon),
        ]);

        // Update the state with the fetched weather and forecast data, and resolve the location information if necessary
        setWeather(weather);
        setForecast(days);
        const location = await getLocationInfo(weather.lat, weather.lon);
        // Update the location state with the resolved location information, using the provided state and country if available, or falling back to the resolved values
        setLocation({
          state: state || location.state,
          country: country || location.country,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        // Set the loading state to false after the data has been fetched or an error has occurred
        setLoading(false);
      }
    }
    load();
  }, [city, country, lat, lon, state]);

  // Helper function to convert and display temperature based on the selected unit (Fahrenheit or Celsius)
  const showTemp = (f: number) =>
  unit === "F" ? f : convertToCelsius(f);

  // Helper function to display wind speed in the appropriate unit based on the selected temperature unit (Fahrenheit or Celsius)
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
          // Render a dropdown component to allow users to select the temperature unit (Fahrenheit or Celsius), with styles and colors based on the current theme
            data={unitOptions}
            labelField="label"
            valueField="value"
            value={unit}
            onChange={(option) => setUnit(option.value)}

            selectedTextStyle={{ color: theme.text }}
            placeholderStyle={{ color: theme.placeholder }}
            itemTextStyle={{ color: theme.text }}
            containerStyle={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
            }}
            activeColor={theme.divider}
          />
        </View>
      }
      // Render each forecast item in the FlatList, displaying the day, weather icon, and high/low temperatures based on the selected unit
      renderItem={({ item, index }) => (
        // Render a view for each forecast item, applying styles based on its position in the list (first, last, or middle)
        <View style={[
          styles.forecast,
          index === 0 && styles.forecastFirst,
          index === forecast.length - 1 && styles.forecastLast,
      ]}
    >
          <Text style = {styles.forecastText }>{[ index > 0 && item.day, index === 0 && "Today"]}</Text> // Display "Today" for the first item and the day of the week for subsequent items
          <Image source={item.weatherIcon} />
          <Text style = {styles.forecastTemp}>{showTemp(item.highF)}° / {showTemp(item.lowF)}°</Text>
        </View>
      )}
    />

    // Render a button to navigate back to the home screen, using the router to push the root path ("/") when pressed
    <TouchableOpacity style={styles.homeButton} onPress={() => {
      router.push({ pathname: "/" as any });}}>
      <AntDesign name="home" size={30} color="#fff" />
    </TouchableOpacity>

    // Render a button to save the current city to the database, using the saveCity function and passing the necessary information (name, state, country, latitude, and longitude) when pressed
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
      <AntDesign name="star" size={30} color="#fff" />
    </TouchableOpacity>
    
    // Render a button to toggle between light and dark themes, using the current color scheme to determine the icon and action
    <TouchableOpacity
      style={styles.themeButton}
      onPress={() => Appearance.setColorScheme(scheme === "dark" ? "light" : "dark")}
    >
      <MaterialCommunityIcons
        name={scheme === "dark" ? "weather-sunny" : "weather-night"}
        size={30}
        color={"white"}
      />
    </TouchableOpacity>
  </View>
  );
}