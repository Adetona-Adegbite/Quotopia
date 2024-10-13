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
import * as Notifications from "expo-notifications";
// @ts-ignore

import { setCustomText } from "react-native-global-props";
import { useEffect } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const loadFonts = async () => {
  await Font.loadAsync({
    Poppins: require("./assets/Poppins-Regular.ttf"),
    "Poppins-Bold": require("./assets/Poppins-Bold.ttf"),
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
  async function registerForPushNotificationsAsync() {
    let token;
    const { status } = await Notifications.getPermissionsAsync();

    if (status !== "granted") {
      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") {
        alert("Failed to get push token for notifications!");
        return;
      }
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    AsyncStorage.setItem("notification-token", token);
  }

  useEffect(() => {
    registerForPushNotificationsAsync();
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      }
    );

    return () => subscription.remove();
  }, []);
  useEffect(() => {
    loadFonts().then(() => {
      const customTextProps = {
        style: {
          fontFamily: "Poppins",
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
          <Stack.Screen name="Main-Pages" component={MainPages} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
