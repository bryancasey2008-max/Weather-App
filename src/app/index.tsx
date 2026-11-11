import { getSavedCities, removeCity, SavedCity } from "@/savedCities";
import { useStyles } from "@/styles";
import { useTheme } from "@/themes";
import { Place, searchPlaces } from "@/weather";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Appearance, Image, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";

Appearance.setColorScheme("light"); // Set the default color scheme to light mode

export default function Index() {
  const styles = useStyles();
  const scheme = useColorScheme();
  const [text, setText] = useState("");
  const theme = useTheme();
  const [suggestions, setSuggestions] = useState<Place[]>([]); // State to hold the list of suggested places based on user input
  const [saved, setSaved] = useState<SavedCity[]>([]); // State to hold the list of saved cities retrieved from the database

  // Fetch the saved cities from the database whenever the screen gains focus
  useFocusEffect(
    useCallback(() => {
      getSavedCities().then(setSaved);
    }, [])
  );

  // Fetch the suggested places based on user input with a debounce effect
  useEffect(() => {

    const timer = setTimeout(async () => {
      try {
        setSuggestions(await searchPlaces(text));
      } catch {
        setSuggestions([]);
      }
    }, 400);

    // Clear the timeout if the component unmounts or if the text changes before the timeout completes
    return () => clearTimeout(timer);
  }, [text]);

  // Helper function to generate a label for a place, combining its name, state, and country
  const label = (p: Place) =>
    [p.name, p.state, p.country].filter(Boolean).join(", ");

  // Function to navigate to the weather information screen for a selected place
  const goTo = (p: Place) => {
    setSuggestions([]);
    router.push({
      pathname: "/weatherInfoScreen" as any,
      params: {
        city: p.name,
        state: p.state ?? "",
        country: p.country,
        lat: String(p.lat),
        lon: String(p.lon),
      },
    });
  };

  // Render the main UI of the app, including the search input, suggestions, and saved cities
  return (
    <View style = {{flex: 1}}>

      <ScrollView style={styles.container}   contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Weather App <Image source={require('@/assets/images/WeatherIcons/01d_t.png')} style={{ width: 70}} /></Text>
        <Text style={styles.city}>Enter in a town/city</Text>

        <View style={styles.searchResults}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
          />
        </View>
        {/* Display the list of suggested places based on user input, if any suggestions are available */}
        {suggestions.length > 0 && (
          <View style={styles.searchResults}>
            {/* Map through the suggestions and render each one as a touchable item that navigates to the weather information screen when pressed */}
            {suggestions.map((p, i) => (
              <TouchableOpacity
                key={`${p.lat},${p.lon}`}
                style={{
                  padding: 12,
                  borderTopWidth: i === 0 ? 0 : 1,
                  borderTopColor: "#ddd",
                }}
                onPress={() => goTo(p)}
              >
                <Text style={styles.dropdownText}>{label(p)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Display the list of saved cities retrieved from the database, allowing users to navigate to their weather information or remove them from the list */}
        <Text style={styles.sectionTitle}>Saved Cities</Text>
        {saved.map((c) => (
          <TouchableOpacity
          style = {styles.savedResults}
            key={c.id}
            onPress={() =>
              router.push({
                pathname: "/weatherInfoScreen" as any,
                params: {
                  city: c.name,
                  lat: String(c.lat),
                  lon: String(c.lon),
                  state: c.state ?? "",
                  country: c.country,
                },
              })
            }
            
          
          >
            {/* Display the name, state, and country of the saved city, and provide a trash icon to remove it from the list */}
            <Text style={styles.dropdownText}>{[c.name, c.state, c.country].filter(Boolean).join(", ")}</Text>
            <MaterialCommunityIcons name="trash-can-outline" size={30}  color={theme.text}           
            onPress={async () => {
              await removeCity(c.id);
              setSaved(await getSavedCities());
            }}/>
          </TouchableOpacity>
          
        ))}
      </ScrollView>
      
      {/* Render a button to toggle between light and dark themes, using the current color scheme to determine the icon and action */}
      <TouchableOpacity
        style={styles.themeButton}
        onPress={() => Appearance.setColorScheme(scheme === "dark" ? "light" : "dark")}
      >
        {/* Display the appropriate icon based on the current color scheme, indicating the action to switch themes */}
        <MaterialCommunityIcons
          name={scheme === "dark" ? "weather-sunny" : "weather-night"}
          size={30}
          color={"white"}
        />
      </TouchableOpacity>
    </View>
  );
}