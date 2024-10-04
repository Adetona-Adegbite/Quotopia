import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedPage from "./screens/TabScreens/Feed";
import ExplorePage from "./screens/TabScreens/Explore";
import ProfilePage from "./screens/TabScreens/Profile";
import LandingPage from "./screens/LandingPage/Landing";
import LoginPage from "./screens/AuthPages/Login";
import { NavigationContainer } from "@react-navigation/native";
import RegisterPage from "./screens/AuthPages/Register";
import CustomTabBar from "./components/CustomTabBar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Font from "expo-font";
// @ts-ignore

import { setCustomText } from "react-native-global-props";
import { useEffect } from "react";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const loadFonts = async () => {
  await Font.loadAsync({
    Poppins: require("./assets/Poppins-Regular.ttf"), // Adjust the path as necessary
    "Poppins-Bold": require("./assets/Poppins-Bold.ttf"), // Load bold variant if needed
  });
  console.log("Done");
};
function LandingPages() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Landing"
        component={LandingPage}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Register"
        component={RegisterPage}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Login"
        component={LoginPage}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Main"
        component={MainPages}
      />
    </Stack.Navigator>
  );
}

function MainPages() {
  return (
    // @ts-ignore

    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen
        options={{ headerShown: false }}
        name="Feed"
        component={FeedPage}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Explore"
        component={ExplorePage}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Profile"
        component={ProfilePage}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    loadFonts().then(() => {
      // Set custom text properties after fonts are loaded
      const customTextProps = {
        style: {
          fontFamily: "Poppins", // Set the default font
        },
      };
      setCustomText(customTextProps);
      console.log("Done 2");
    });
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Landing-Pages"
            component={LandingPages}
          />
          <Stack.Screen name="Settings" component={MainPages} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
