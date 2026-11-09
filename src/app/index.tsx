import { useEffect, useState } from "react";
import { Text, TextInput, View, TouchableOpacity } from "react-native";
import { styles } from "@/styles";
import { router } from "expo-router";
import { searchPlaces, Place } from "@/weather";

export default function Index() {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<Place[]>([]);

  useEffect(() => {
    if (text.trim().length < 3) {
      setSuggestions([]);
      return;
    }

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
    <View style={styles.container}>
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
              <Text>{label(p)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text>Recently Searched</Text>
      <Text>Favorites</Text>
    </View>
  );
}