import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore"; // Import Firestore related functions
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage for persistence
import MapView from "react-native-maps"; // Import MapView for rendering location messages
import CustomActions from "./CustomActions"; // Import custom actions component
import { Audio } from "expo-av"; // Import Audio module for playing audio messages

const Chat = ({ db, route, navigation, isConnected, storage }) => {
  const [messages, setMessages] = useState([]); // State to store chat messages
  const { name, id } = route.params; // Extract name and user ID from route params
  const { backgroundColor } = route.params; // Extract background color from route params
  let soundObject = null; // Variable to store sound object for audio messages

  let unsubMessages; // Subscription function to unsubscribe from Firestore snapshot

  // Effect to set navigation options and fetch messages when component mounts or connection status changes
  useEffect(() => {
    navigation.setOptions({ title: name }); // Set navigation title to user's name

    // Fetch messages from Firestore if connected, otherwise load cached messages
    if (isConnected === true) {
      if (unsubMessages) unsubMessages(); // Unsubscribe from previous snapshot listener
      unsubMessages = null;

      const q = query(collection(db, "messages"), orderBy("createdAt", "desc")); // Query messages collection ordered by creation time
      unsubMessages = onSnapshot(q, (docs) => {
        // Subscribe to query snapshot and update messages state
        let newMessages = [];
        docs.forEach((doc) => {
          // Iterate through documents and format message data
          newMessages.push({
            _id: doc.id, // Add a unique ID for each message
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()), // Convert Firestore timestamp to Date object
          });
        });
        cacheMessages(newMessages); // Cache fetched messages
        setMessages(newMessages); // Update messages state with new messages
      });
    } else {
      loadCachedMessages(); // Load cached messages if offline
    }

    // Clean-up function to unsubscribe from snapshot listener
    return () => {
      if (unsubMessages) unsubMessages(); // Unsubscribe from snapshot listener if it exists
      if (soundObject) soundObject.unloadAsync(); // Unload audio player if it exists
    };
  }, [isConnected]); // Run effect when isConnected state changes

  // Function to load cached messages from AsyncStorage
  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem("messages")) || []; // Get cached messages from AsyncStorage
    setMessages(JSON.parse(cachedMessages)); // Update messages state with cached messages
  };

  // Function to cache messages in AsyncStorage
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache)); // Store messages in AsyncStorage
    } catch (error) {
      console.log(error.message); // Log error if caching fails
    }
  };

  // Function to send new messages to Firestore
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]); // Add new message to Firestore messages collection
  };

  // Function to render input toolbar based on connection status
  const renderInputToolbar = (props) => {
    if (isConnected === true)
      return (
        <InputToolbar {...props} containerStyle={styles.input} />
      ); // Render input toolbar if connected
    else return null; // Otherwise, render nothing
  };

  // Function to customize message bubble style
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000", // Style for sender's messages
          },
          left: {
            backgroundColor: "#FFF", // Style for other participants' messages
          },
        }}
      />
    );
  };

  // Function to render custom actions component
  const renderCustomActions = (props) => {
    return (
      <CustomActions onSend={onSend} storage={storage} {...props} id={id} /> // Render custom actions component
    );
  };

  // Function to render custom view for location messages
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      ); // Render MapView component for location messages
    }
    return null; // Return null for other message types
  };

  // Function to render audio messages with play button
  const renderMessageAudio = (props) => {
    return (
      <View {...props}>
        <TouchableOpacity
          style={{ backgroundColor: "#FF0", borderRadius: 10, margin: 5 }}
          onPress={async () => {
            try {
              console.log(
                "Playing sound from URI:",
                props.currentMessage.audio
              ); // Log URI of audio file for debugging

              // Stop and unload any currently playing sound
              if (soundObject) {
                await soundObject.unloadAsync();
                soundObject.setOnPlaybackStatusUpdate(null); // Remove event listener
                soundObject = null; // Reset sound object
              }

              // Create a new sound object and play audio
              soundObject = new Audio.Sound();
              await soundObject.loadAsync({ uri: props.currentMessage.audio }); // Load audio file
              soundObject.setOnPlaybackStatusUpdate((status) => {
                // Set playback status update listener
                if (status.didJustFinish && !status.isLooping) {
                  soundObject.unloadAsync(); // Unload sound after playback
                }
              });
              await soundObject.playAsync(); // Play audio
            } catch (error) {
              console.error("Error playing sound:", error); // Log error if playback fails
              Alert.alert("Playback Error", "Failed to play sound."); // Show alert for playback error
            }
          }}
        >
          <Text style={{ textAlign: "center", color: "black", padding: 5 }}>
            Play Sound
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Return the chat UI with GiftedChat component
  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={(messages) => onSend(messages)}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        renderMessageAudio={renderMessageAudio}
        user={{
          _id: id,
          name,
        }}
      />

      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    paddingBottom: 5,
  },
});

export default Chat;
