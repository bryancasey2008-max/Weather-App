import { useState } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";

export default function Index() {

  const[text, setText] = useState('');
  return (
    <View style={styles.container}>
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
      <TextInput
      style = {styles.input}
      placeholder = "Hello World"
      value={text}
      onChangeText={(newValue => setText(newValue))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: 200,
    height: 50,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 25
  },
  container: {
    fontFamily: "Avenir Next",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
