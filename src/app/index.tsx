import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { styles } from "@/styles";
import { getWeather } from "@/weather";
import { router } from "expo-router";


export default function Index() {

  const[text, setText] = useState('');
  return (
    <View style={styles.container}>
      <TextInput
      style = {styles.input}
      placeholder = "Hello World"
      value={text}
      onChangeText={(newValue => setText(newValue))}
      />

      <Pressable style={styles.button} onPress={() => {
        getWeather(text); 
        router.push({ pathname: "/weatherInfoScreen" as any, params: { city: text } });
        }}>
        <Text style = {styles.buttonText}>Submit</Text>
      </Pressable>
    </View>
  );
}


