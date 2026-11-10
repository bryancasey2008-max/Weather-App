import { useColorScheme } from "react-native";

const light = {
  background: "hsl(140, 20%, 96%)",
  text: "#111111",
  mutedText: "#555555",
  surface: "#ffffff",
  border: "#ccc",
  divider: "#ddd",
  forecast: "#2e5eff",
  shadow: "#215999",
  placeholder: "#888888",
};

const dark = {
  background: "#121212",
  text: "#f5f5f5",
  mutedText: "#b0b0b0",
  surface: "#1f1f1f",
  border: "#444444",
  divider: "#333333",
  forecast: "#2349c4",
  shadow: "#000000",
  placeholder: "#888888",
};

export type Theme = typeof light;

export function useTheme(): Theme {
  return useColorScheme() === "dark" ? dark : light;
}