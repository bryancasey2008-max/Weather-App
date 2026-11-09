import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  input: {
    width: 300,
    height: 50,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 25
  },

  searchResults: {
    width: 300, 
    backgroundColor: "#fff", 
    borderRadius: 10
  },
  
  container: {
    fontFamily: "Avenir Next",
    flex: 1,
    alignItems: "center",
    marginTop: 50,
    backgroundColor: "hsl(140, 20%, 96%)"
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
    fontSize: 30,
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
  },

  forecast: {
    flexDirection: "row",
    margin: "auto",
    justifyContent: "center",
    padding: 12,
    width: 300,
    backgroundColor: "#2e5eff",
    borderBottomWidth: 2,
    borderBottomColor: "rgba(255,255,255,0.5)",
  },

  forecastText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    padding: 5
  },

  forecastIcon:{
    fontSize: 30,
    marginLeft: 10
  },

  forecastTemp: {
    color: "white",
    fontSize: 20,
    marginLeft: 80,
    fontWeight: "bold",
    padding: 5
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
    boxShadow: "2px 2px 8px #215999"
  },

  dropdown: {
    marginTop: 20,
    width: 180,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderColor: "black",
    borderWidth: 2
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
    boxShadow: "2px 2px 8px #215999",
  }
});