import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected, storage }) => {
  const { name, backgroundColor, id } = route.params;
  const [messages, setMessages] = useState([]);
  let soundObject = null;

  // Messages database
  let unsubscribe;
  useEffect(() => {
    if (isConnected === true) {
      // unregister current onSnapshot() listener to avoid registering multiple listeners when useEffect code is re-executed.
      if (unsubscribe) unsubscribe();
      unsubscribe = null;

      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubscribe = onSnapshot(q, (documentSnapshot) => {
        let newMessages = [];
        documentSnapshot.forEach((doc) => {
          newMessages.push({
            _id: doc.id, // Use Firestore document ID as the unique identifier
            text: doc.data().text,
            createdAt: new Date(doc.data().createdAt.toMillis()),
            user: doc.data().user,
          });
        });
        cacheMessagesHistory(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    // Clean up code
    return () => {
      if (unsubscribe) unsubscribe();
      if (soundObject) soundObject.unloadAsync();
    };
  }, [isConnected]);

  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem("chat_messages")) || [];
    setMessages(JSON.parse(cachedMessages));
  };

  const cacheMessagesHistory = async (listsToCache) => {
    try {
      await AsyncStorage.setItem("chat_messages", JSON.stringify(listsToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  // Customize speech bubble
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#757083",
          },
          left: {
            backgroundColor: "lightgray",
          },
        }}
      />
    );
  };

  // Prevent rendering of InputToolbar when offline
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  // Set user name
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={(messages) => onSend(messages)}
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
});

export default Chat;
