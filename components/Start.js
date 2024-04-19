import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

// Start component
const Start = ({ navigation }) => {
  // State variables for user name and selected background color
  const [name, setName] = useState("");
  const [background, setBackground] = useState("");

  // Function to navigate to the Chat screen
  const goToChat = () => {
    navigation.navigate("Chat", {
      name: name,
      backgroundColor: background,
    });
  };

  return (
    // Outer container to hold the entire content
    <View style={styles.outerContainer}>
      {/* Background image */}
      <ImageBackground
        source={require("../image/Background Image.png")}
        resizeMode="cover"
        style={styles.image}
      >
        {/* Inner container to center content vertically */}
        <View style={styles.innerContainer}>
          {/* Text input for user to enter their name */}
          <Text>Hello World!</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Type your username here"
          />
          {/* Container for color selection */}
          <View style={styles.chooseColorBox}>
            {/* Text indicating color selection */}
            <Text style={styles.chooseColorText}>Choose Background Color:</Text>
            {/* Container for color buttons */}
            <View style={styles.colorButtonsContainer}>
              {/* Render a TouchableOpacity for each color option */}
              <TouchableOpacity
                style={[styles.chooseColor, { backgroundColor: "#494B4E" }]}
                onPress={() => setBackground("#494B4E")}
              ></TouchableOpacity>
              <TouchableOpacity
                style={[styles.chooseColor, { backgroundColor: "#6F8AC7" }]}
                onPress={() => setBackground("#6F8AC7")}
              ></TouchableOpacity>
              <TouchableOpacity
                style={[styles.chooseColor, { backgroundColor: "#B3D791" }]}
                onPress={() => setBackground("#B3D791")}
              ></TouchableOpacity>
              <TouchableOpacity
                style={[styles.chooseColor, { backgroundColor: "#E4D0E1" }]}
                onPress={() => setBackground("#E4D0E1")}
              ></TouchableOpacity>
            </View>
          </View>

          {/* Button to start chat */}
          <TouchableOpacity style={styles.button} onPress={goToChat}>
            <Text style={styles.textButton}>Start Chat</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

// Styles for the Start component
const styles = StyleSheet.create({
  // Outer container style
  outerContainer: {
    flex: 1,
    backgroundColor: "#1A3986",
  },
  // Inner container style
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Text input style
  textInput: {
    width: "88%",
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
  },
  // Image background style
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  // Container for color selection style
  chooseColorBox: {
    marginTop: 20,
    alignItems: "center",
  },
  // Text style for color selection
  chooseColorText: {
    marginBottom: 10,
  },
  // Container for color buttons style
  colorButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  // Individual color button style
  chooseColor: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  // Button style
  button: {
    backgroundColor: "#1A3986",
    padding: 10,
    borderRadius: 5,
  },
  // Text style for button
  textButton: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Start;
