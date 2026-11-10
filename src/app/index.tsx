import { getSavedCities, removeCity, SavedCity } from "@/savedCities";
import { useStyles } from "@/styles";
import { useTheme } from "@/themes";
import { Place, searchPlaces } from "@/weather";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Appearance, Image, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";

Appearance.setColorScheme("light");

export default function Index() {
  const styles = useStyles();
  const scheme = useColorScheme();
  const [text, setText] = useState("");
  const theme = useTheme();
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [saved, setSaved] = useState<SavedCity[]>([]);

  useFocusEffect(
    useCallback(() => {
      getSavedCities().then(setSaved);
    }, [])
  );

  useEffect(() => {

    // Wait 400ms after the user stops typing before searching
    const timer = setTimeout(async () => {
      try {
        setSuggestions(await searchPlaces(text));
      } catch {
        setSuggestions([]);
      }
    }, 400);

    // Cancel the pending search if the user types again
    return () => clearTimeout(timer);
  }, [text]);

  const label = (p: Place) =>
    [p.name, p.state, p.country].filter(Boolean).join(", ");

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

        {suggestions.length > 0 && (
          <View style={styles.searchResults}>
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
            <Text style={styles.dropdownText}>{[c.name, c.state, c.country].filter(Boolean).join(", ")}</Text>
            <MaterialCommunityIcons name="trash-can-outline" size={30}  color={theme.text}           
            onPress={async () => {
              await removeCity(c.id);
              setSaved(await getSavedCities());
            }}/>
          </TouchableOpacity>
          
        ))}
      </ScrollView>

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