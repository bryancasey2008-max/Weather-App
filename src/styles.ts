import { StyleSheet } from "react-native";
import { useMemo } from "react";
import { useTheme } from "@/themes";

export function useStyles() {
  const theme = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        input: {
          width: 300,
          height: 50,
          borderRadius: 8,
          borderColor: theme.border,
          borderWidth: 1,
          paddingHorizontal: 12,
          marginBottom: 12,
          fontSize: 25,
          color: theme.text,
          backgroundColor: theme.surface,
        },

        searchResults: {
          width: 300,
          backgroundColor: theme.surface,
          borderRadius: 10,
        },

        container: {
          fontFamily: "Avenir Next",
          flex: 1,
          marginTop: 50,
          backgroundColor: theme.background,
        },

        buttonText: {
          textAlign: "center",
          fontSize: 20,
          color: "white",
          fontWeight: "bold",
        },

        sectionTitle: {
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 20,
          marginBottom: 10,
          textAlign: "center",
          color: theme.text,
        },

        savedResults: {
          fontSize: 20,
          padding: 12,
          width: 300,
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: theme.divider,
          color: theme.text,
        },

        weatherInfo: {
          margin: 50,
          marginTop: 100,
        },

        city: {
          fontSize: 30,
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: 15,
          color: theme.text,
        },

        temperature: {
          fontSize: 45,
          textAlign: "center",
          marginBottom: 15,
          color: theme.text,
        },

        desc: {
          fontSize: 25,
          textAlign: "center",
          color: theme.text,
        },

        humidity: {
          fontSize: 15,
          textAlign: "center",
          color: theme.mutedText,
        },

        forecast: {
          flexDirection: "row",
          margin: "auto",
          justifyContent: "center",
          padding: 12,
          width: 300,
          backgroundColor: theme.forecast,
          borderBottomWidth: 2,
          borderBottomColor: "rgba(255,255,255,0.5)",
        },

        forecastText: {
          color: "white",
          fontSize: 20,
          fontWeight: "bold",
          padding: 5,
        },

        forecastIcon: {
          fontSize: 30,
          marginLeft: 10,
        },

        forecastTemp: {
          color: "white",
          fontSize: 20,
          marginLeft: 80,
          fontWeight: "bold",
          padding: 5,
        },

        forecastFirst: {
          paddingTop: 20,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        },

        forecastLast: {
          paddingBottom: 20,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          borderBottomWidth: 0,
          boxShadow: `2px 2px 8px ${theme.shadow}`,
        },

        dropdown: {
          marginTop: 20,
          width: 180,
          height: 40,
          paddingHorizontal: 12,
          borderRadius: 15,
          borderColor: theme.text,
          borderWidth: 2,
        },

        dropdownText: {
          color: theme.text,
          fontSize: 20,
        },

        homeButton: {
          position: "absolute",
          backgroundColor: "#2e5eff",
          width: 50,
          height: 50,
          top: 50,
          left: 16,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 20,
          boxShadow: `2px 2px 8px ${theme.shadow}`,
        },

        saveButton: {
          position: "absolute",
          backgroundColor: "#81569e",
          width: 50,
          height: 50,
          top: 50,
          left: 80,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 20,
          boxShadow: `2px 2px 8px ${theme.shadow}`,
        },
      }),
    [theme]
  );
}