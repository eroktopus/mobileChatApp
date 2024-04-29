import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import Start from "./components/Start"; // Importing the Start component
import Chat from "./components/Chat"; // Importing the Chat component

import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect } from "react";
import { LogBox, Alert } from "react-native";

LogBox.ignoreLogs(["AsyncStorage has been extracted from"]); // Ignoring specific logs

const Stack = createNativeStackNavigator(); // Creating a stack navigator

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgj5ERTGOQb7oJfgoJq-7gBGmHYVuA-vM",
  authDomain: "mobilechatapp-ff092.firebaseapp.com",
  projectId: "mobilechatapp-ff092",
  storageBucket: "mobilechatapp-ff092.appspot.com",
  messagingSenderId: "636014727430",
  appId: "1:636014727430:web:b0a53aed9160fb040f8e87",
};

const app = initializeApp(firebaseConfig); // Initializing Firebase app
const db = getFirestore(app); // Getting Firestore instance
const storage = getStorage(app); // Getting Firebase Storage instance

const App = () => {
  const connectionStatus = useNetInfo(); // Getting network connection status

  useEffect(() => {
    // Effect hook to handle network connection changes
    if (connectionStatus.isConnected === false) {
      // If network is disconnected, show alert and disable network
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      // If network is connected, enable network
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]); // Depend on connection status changes

  return (
    // Main App component
    <NavigationContainer>
      {/* Navigation container for managing navigation state */}
      <Stack.Navigator initialRouteName="Start">
        {/* Stack navigator with initial route set to "Start" */}
        <Stack.Screen name="Start" component={Start} />
        {/* Screen for the Start component */}
        <Stack.Screen name="Chat">
          {/* Screen for the Chat component */}
          {(props) => (
            // Passing props to Chat component and rendering it
            <Chat
              isConnected={connectionStatus.isConnected} // Passing network connection status
              storage={storage} // Passing Firebase Storage instance
              db={db} // Passing Firestore instance
              {...props} // Passing other props
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App; // Exporting the main App component
