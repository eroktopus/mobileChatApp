import Start from "./components/Start";
import Chat from "./components/Chat";

// import react Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Create the navigator
const Stack = createNativeStackNavigator();

// App component
const App = () => {
  return (
    // Navigation container to wrap the navigator
    <NavigationContainer>
      {/* Stack navigator to manage navigation between screens */}
      <Stack.Navigator initialRouteName="Start">
        {/* Start screen */}
        <Stack.Screen
          name="Home"
          component={Start}
          // Options for the header of the Start screen
          options={{
            headerStyle: { backgroundColor: "#1A3986" },
            headerTintColor: "white",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />
        {/* Chat screen */}
        <Stack.Screen
          name="Chat"
          component={Chat}
          // Options for the header of the Chat screen
          options={{
            headerStyle: { backgroundColor: "#1A3986" },
            headerTintColor: "white",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
