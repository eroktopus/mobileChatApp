import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Import your components
import Start from "./components/Start";
import Chat from "./components/Chat";

const Stack = createNativeStackNavigator();

const App = () => {
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
  const db = getFirestore(app); // Initialize Firestore

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        {/* Pass the db prop to the Chat component */}
        <Stack.Screen name="Chat">
          {(props) => <Chat {...props} db={db} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
