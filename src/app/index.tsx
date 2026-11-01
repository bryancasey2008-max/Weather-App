import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { styles } from "@/styles";
import { showWeather } from "@/weather";


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

      <Pressable style={styles.button} onPress={() => showWeather(text)}>
        <Text style = {styles.buttonText}>Learn More</Text>
      </Pressable>
    </View>
  );
}


