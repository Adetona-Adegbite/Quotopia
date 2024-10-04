import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Pressable,
  Platform,
} from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import image from "../../assets/landing-page-image.png";

const data = [
  {
    id: "1",
    title: "Welcome to Quotopia!",
    description:
      "This app is all about sharing uplifting quotes, words of encouragement, and positive vibes. Whether it's for yourself or others, your words can brighten someone's day!",
  },
  {
    id: "2",
    title: "Curate Your Visuals",
    description:
      "Download aesthetic images from our gallery to enhance your posts and inspire creativity.",
  },
  {
    id: "3",
    title: "What to Post",
    description:
      "Share made up or existing quotes or uplifting thoughts that motivate and spread positivity.",
  },
];

const { width, height } = Dimensions.get("screen");

// @ts-ignore
export default function LandingPage({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.floor((contentOffsetX / width) * 1.5); // Adjust for card width
    setCurrentIndex(newIndex);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={style.page}>
        <Image source={image} style={style.image} />
        <FlatList
          data={data}
          horizontal
          renderItem={({ item }) => (
            <View style={style.card}>
              <Text style={style.title}>{item.title}</Text>
              <Text style={style.description}>{item.description}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          snapToInterval={width * 0.9}
          decelerationRate="fast"
          style={style.flatList}
          contentContainerStyle={{ alignItems: "center" }}
        />
        <View style={style.pagination}>
          {data.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                style.dot,
                index === currentIndex ? style.activeDot : style.inactiveDot,
              ]}
              onPress={() => setCurrentIndex(index)}
            />
          ))}
        </View>
        <View style={style.buttons}>
          <Pressable
            onPress={() => {
              navigation.navigate("Login");
            }}
            style={style.button1}
          >
            <Text style={{ color: "white" }}>Login</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate("Register");
            }}
            style={style.button2}
          >
            <Text style={{ color: "#5FB49C" }}>Register</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: height * 0.5,
    resizeMode: "contain",
  },
  flatList: {
    flexGrow: 0,
    // borderWidth: 1,
    width: width * 0.9,
  },
  card: {
    width: width * 0.9,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 4,
    color: "#515851",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#5FB49C",
  },
  inactiveDot: {
    backgroundColor: "#cccccc",
  },
  buttons: {
    flexDirection: "row",
    // borderWidth: 1,
    width: "90%",
    justifyContent: "space-between",
    alignSelf: "center",
    marginTop: 30,
    gap: 15,
  },
  button1: {
    padding: Platform.OS == "ios" ? 23 : 16,
    backgroundColor: "#5FB49C",
    width: "50%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  button2: {
    padding: Platform.OS == "ios" ? 23 : 16,
    borderWidth: 2,
    borderColor: "#5FB49C",
    width: "50%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
