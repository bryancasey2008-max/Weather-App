import { styles } from "@/styles";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";


export default function WeatherInfo() {
  const { city } = useLocalSearchParams<{ city: string }>();
  return (
    <View style={styles.container}>
      <Text>{city}</Text>
    </View>
  );
}


