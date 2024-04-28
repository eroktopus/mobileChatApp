import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  enableNetwork,
  disableNetwork,
} from "firebase/firestore";
import { Alert } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";

// Import your components
import Start from "./components/Start";
import Chat from "./components/Chat";

const Stack = createNativeStackNavigator();

const App = () => {
  const connectionStatus = useNetInfo();
  const [isConnected, setIsConnected] = useState(false); // Initialize to false

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCgj5ERTGOQb7oJfgoJq-7gBGmHYVuA-vM",
    authDomain: "mobilechatapp-ff092.firebaseapp.com",
    projectId: "mobilechatapp-ff092",
    storageBucket: "mobilechatapp-ff092.appspot.com",
    messagingSenderId: "636014727430",
    appId: "1:636014727430:web:b0a53aed9160fb040f8e87",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  useEffect(() => {
    setIsConnected(connectionStatus.isConnected);
  }, [connectionStatus.isConnected]);

  useEffect(() => {
    if (isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db);
    } else if (isConnected === true) {
      enableNetwork(db);
    }
  }, [isConnected]);

  // Log isConnected
  console.log("isConnected:", isConnected);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen
          name="Chat"
          options={{ title: "Chat" }}
          // Pass the navigation prop to the Chat component
          children={({ navigation, route }) => (
            <Chat
              db={db}
              isConnected={isConnected}
              navigation={navigation}
              route={route}
            />
          )}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
