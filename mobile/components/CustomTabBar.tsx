import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import TabBarIcon from "./TabBarIcon";
import { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  NavigationHelpers,
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import { BottomTabNavigationEventMap } from "@react-navigation/bottom-tabs";

const { width } = Dimensions.get("window");

interface CustomTabBarProps {
  state: {
    index: number;
    routes: Array<{
      key: string;
      name: string;
      params?: any;
    }>;
  };
  descriptors: {
    [key: string]: {
      options: {
        tabBarLabel?: string;
        title?: string;
      };
    };
  };
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const translateX = useSharedValue(0);
  const [dimensions, setDimensions] = useState({ width: 200, height: 100 });

  const buttonWidth = dimensions.width / state.routes.length;

  const onTabBarLayout = (e: any) => {
    setDimensions({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  useEffect(() => {
    translateX.value = withSpring(buttonWidth * state.index, {
      duration: 1300,
    });
  }, [state.index]);

  const rCircle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.tabBarContainer} onLayout={onTabBarLayout}>
      <Animated.View
        style={[
          rCircle,
          {
            width: buttonWidth - 12,
            height: dimensions.height - 15,
            position: "absolute",
            backgroundColor: "#fff",
            borderRadius: 40,
            zIndex: -1,
            marginHorizontal: 6,
          },
        ]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarIcon
            key={label}
            onPress={onPress}
            isFocused={isFocused}
            label={label}
          />
        );
      })}
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    height: 80,
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "#5FB49C",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "space-evenly",
    width: width * 0.95,
    bottom: Platform.OS == "ios" ? 40 : 10,
    paddingVertical: 15,
    shadowColor: "black",
    shadowOffset: { height: 10, width: 0 },
    shadowRadius: 15,
    shadowOpacity: 0.5,
    elevation: 15,
  },
});
