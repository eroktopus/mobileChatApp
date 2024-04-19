import { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";

// Chat component
const Chat = ({ route, navigation }) => {
  // Destructuring route params
  const { name, backgroundColor } = route.params;

  // useEffect to set navigation options
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  // Render method
  return (
    // View container with dynamic background color
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      {/* Rest of your component */}
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Chat;
