import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
  button: {
    backgroundColor: "#2e5eff",
    width: 150,
    padding: 10,
    borderRadius: 5,
    boxShadow: "2px 2px 8px #215999"
  },
  buttonText: {
    textAlign:"center",
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  weatherInfo: {
    margin: 50,
    marginTop: 100,
  },
  city:{
    fontSize: 50,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 15
  },

  temperature: {
    fontSize: 45,
    textAlign: "center",
    marginBottom: 15
  },

  desc: {
    fontSize: 25,
    textAlign: "center",
  },

  humidity: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20
  }
});