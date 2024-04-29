import React from "react";
import { useEffect } from "react"; // Import useEffect hook
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"; // Import necessary components from React Native
import { useActionSheet } from "@expo/react-native-action-sheet"; // Import useActionSheet hook from Expo action sheet library
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import functions for interacting with Firebase Storage
import { Audio } from "expo-av"; // Import Audio module from Expo for recording audio
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker module from Expo for picking images
import * as Location from "expo-location"; // Import Location module from Expo for fetching user's location

const CustomActions = ({
  wrapperStyle,
  iconTextStyle,
  onSend,
  storage,
  id,
}) => {
  const actionSheet = useActionSheet(); // Initialize useActionSheet hook from Expo
  let recordingObject = null; // Variable to store recording object

  // Function to fetch user's current location and send it as a message
  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync(); // Request location permissions
    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({}); // Get current location
      if (location) {
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        }); // Send location as a message
      } else Alert.alert("Error occurred while fetching location");
    } else Alert.alert("Permissions haven't been granted.");
  };

  // Function to generate a unique reference string for uploaded files
  const generateReference = (uri) => {
    const timeStamp = new Date().getTime(); // Get current timestamp
    const imageName = uri.split("/")[uri.split("/").length - 1]; // Extract image name from URI
    return `${id}-${timeStamp}-${imageName}`; // Generate unique reference string
  };

  // Function to upload image to Firebase Storage and send its URL as a message
  const uploadAndSendImage = async (imageURI) => {
    const uniqueRefString = generateReference(imageURI); // Generate unique reference string
    const newUploadRef = ref(storage, uniqueRefString); // Create reference to new file in storage
    const response = await fetch(imageURI); // Fetch image data
    const blob = await response.blob(); // Convert image data to blob
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      const imageURL = await getDownloadURL(snapshot.ref); // Get download URL of uploaded image
      onSend({ image: imageURL }); // Send image URL as a message
    });
  };

  // Function to launch image picker and handle selected image
  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync(); // Request media library permissions
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync(); // Launch image picker
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      // Upload and send selected image
      else Alert.alert("Permissions haven't been granted.");
    }
  };

  // Function to launch camera and handle captured photo
  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync(); // Request camera permissions
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync(); // Launch camera
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      // Upload and send captured photo
      else Alert.alert("Permissions haven't been granted.");
    }
  };

  // Function to start audio recording
  const startRecording = async () => {
    try {
      let permissions = await Audio.requestPermissionsAsync(); // Request audio recording permissions
      if (permissions?.granted) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        }); // Set audio mode for iOS
        Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
          .then((results) => {
            return results.recording;
          })
          .then((recording) => {
            recordingObject = recording; // Store recording object
            Alert.alert(
              "You are recording...",
              undefined,
              [
                {
                  text: "Cancel",
                  onPress: () => {
                    stopRecording(); // Stop recording if user cancels
                  },
                },
                {
                  text: "Stop and Send",
                  onPress: () => {
                    sendRecordedSound(); // Stop recording and send recorded audio
                  },
                },
              ],
              { cancelable: false }
            );
          });
      }
    } catch (err) {
      Alert.alert("Failed to record!"); // Show alert if recording fails
    }
  };

  // Function to stop audio recording
  const stopRecording = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: false,
    }); // Reset audio mode
    await recordingObject.stopAndUnloadAsync(); // Stop and unload recording
  };

  // Function to send recorded audio
  const sendRecordedSound = async () => {
    await stopRecording(); // Stop recording
    const uniqueRefString = generateReference(recordingObject.getURI()); // Generate unique reference string
    const newUploadRef = ref(storage, uniqueRefString); // Create reference to new file in storage
    const response = await fetch(recordingObject.getURI()); // Fetch recorded audio data
    const blob = await response.blob(); // Convert audio data to blob
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      const soundURL = await getDownloadURL(snapshot.ref); // Get download URL of uploaded audio
      onSend({ audio: soundURL }); // Send audio URL as a message
    });
  };

  useEffect(() => {
    return () => {
      if (recordingObject) recordingObject.stopAndUnloadAsync(); // Stop and unload recording when component unmounts
    };
  }, []);

  // Function to handle action press (opening action sheet)
  const onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Record Audio",
      "Cancel",
    ]; // Options for action sheet
    const cancelButtonIndex = options.length - 1; // Index of cancel button
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage(); // Choose image from library
            return;
          case 1:
            takePhoto(); // Take picture using camera
            return;
          case 2:
            getLocation(); // Send current location
            return;
          case 3:
            startRecording(); // Start audio recording
            return;
          default:
        }
      }
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onActionPress}>
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 10,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

export default CustomActions;
