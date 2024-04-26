import { useState, useEffect } from "react";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from "react-native";
import {
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const Chat = ({ route, db }) => {
  // Receive Firestore db as prop
  const { backgroundColor, name, id } = route.params;
  const [messages, setMessages] = useState([]);

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
      />
    );
  };

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages = [];
      querySnapshot.forEach((doc) => {
        const { text, createdAt, user } = doc.data();
        newMessages.push({
          _id: doc.id,
          text,
          createdAt: createdAt.toDate(), // Convert Firestore Timestamp to Date
          user,
        });
      });
      setMessages(newMessages);
    });

    // Return a cleanup function to unsubscribe from the listener
    return () => unsubscribe();
  }, []);

  // Custom InputToolbar component
  const CustomInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "lightgray", // Background color of the input toolbar
          borderTopColor: "navy", // Border color at the top of the input toolbar
          borderTopWidth: 1, // Border width at the top of the input toolbar
          paddingTop: 8, // Top padding
        }}
        primaryStyle={{
          alignItems: "center", // Align items in the input toolbar
        }}
      />
    );
  };

  const onSend = async (newMessages) => {
    try {
      if (newMessages && newMessages.length > 0) {
        const firstMessage = newMessages[0];
        console.log("First message:", firstMessage); // Log the first message object

        if (firstMessage.user && firstMessage.user._id) {
          console.log("User data:", firstMessage.user); // Log the user object
          await addDoc(collection(db, "messages"), {
            text: firstMessage.text,
            createdAt: firstMessage.createdAt,
            user: {
              _id: firstMessage.user._id,
              name: firstMessage.user.name,
            },
          });
        } else {
          console.error("Error: Invalid user data in message");
        }
      } else {
        console.error("Error: Empty message array");
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: id,
          name,
        }}
        renderInputToolbar={(props) => <CustomInputToolbar {...props} />}
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
});

export default Chat;
