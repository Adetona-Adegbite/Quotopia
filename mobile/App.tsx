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

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}

export default function App() {
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
