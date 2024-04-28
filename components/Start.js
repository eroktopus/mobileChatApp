import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage for persistence

const Start = ({ navigation }) => {
  const auth = getAuth();
  const [name, setName] = useState("");
  const [background, setBackground] = useState("");

  const signInUser = () => {
    signInAnonymously(auth)
      .then((result) => {
        navigation.navigate("Chat", {
          name: name,
          backgroundColor: background,
          id: result.user.uid,
        });
      })
      .catch((error) => {
        console.error("Error signing in anonymously: ", error);
      });
  };

  return (
    <View style={styles.outerContainer}>
      <ImageBackground
        source={require("../image/Background Image.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.innerContainer}>
          <Text>Hello World!</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Type your username here"
          />
          <View style={styles.chooseColorBox}>
            <Text style={styles.chooseColorText}>Choose Background Color:</Text>
            <View style={styles.colorButtonsContainer}>
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
          <TouchableOpacity style={styles.button} onPress={signInUser}>
            <Text style={styles.textButton}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#1A3986",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    width: "88%",
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  chooseColorBox: {
    marginTop: 20,
    alignItems: "center",
  },
  chooseColorText: {
    marginBottom: 10,
  },
  colorButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  chooseColor: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: "#1A3986",
    padding: 10,
    borderRadius: 5,
  },
  textButton: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Start;
