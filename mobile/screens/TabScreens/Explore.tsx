import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
  Dimensions,
} from "react-native";
// @ts-ignore

import MasonryList from "react-native-masonry-list";
// @ts-ignore

import image1 from "../../assets/1.jpg";
// @ts-ignore

import image2 from "../../assets/2.jpg";
// @ts-ignore

import image3 from "../../assets/3.png";
// @ts-ignore

import image4 from "../../assets/4.jpg";
// @ts-ignore

import image5 from "../../assets/5.jpg";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Snackbar, TouchableRipple } from "react-native-paper";

const getRandomHeight = () => {
  return Math.floor(Math.random() * (2200 - 1400 + 1)) + 1400;
};

const images = [
  { id: 1, image: image1, height: getRandomHeight() },
  { id: 2, image: image2, height: getRandomHeight() },
  { id: 3, image: image3, height: getRandomHeight() },
  { id: 4, image: image4, height: getRandomHeight() },
  { id: 5, image: image5, height: getRandomHeight() },
];

const { width, height } = Dimensions.get("screen");
export default function ExplorePage() {
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // Function to show the snackbar
  const onPlusIconClick = () => {
    setSnackbarVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ fontSize: 24 }}>Explore</Text>
          <AntDesign
            onPress={onPlusIconClick}
            style={styles.addButton}
            name="pluscircle"
            size={48}
            color="#5FB49C"
          />
        </View>

        <Text style={styles.descriptionText}>
          View the range of aesthetically relaxing images. Or even add your own!
        </Text>

        <MasonryList
          listContainerStyle={{ paddingBotton: 50 }}
          showsVerticalScrollIndicator={false}
          images={images.map((image) => ({
            source: image.image,
            dimensions: { width: 1080, height: image.height },
          }))}
          columns={2} // Number of columns
          // @ts-ignore

          keyExtractor={(item) => item.id.toString()}
          style={styles.masonryList}
          imageContainerStyle={{ borderRadius: 10 }} // Add border radius to images
        />

        {/* Snackbar */}
        <Snackbar
          visible={snackbarVisible}
          theme={{ colors: { primary: "green" } }}
          onDismiss={() => setSnackbarVisible(false)}
          duration={1000}
          style={{
            position: "absolute",
            bottom: height * 0.1,
            zIndex: 10,
            width: "100%",
            backgroundColor: "#5FB49C",
          }}
        >
          Coming Soon! 🚀✨
        </Snackbar>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingVertical: 30,
  },
  ripple: {
    alignSelf: "flex-end", // Align plus icon to the right
    marginBottom: 10,
  },
  addButton: {
    textAlign: "right",
  },
  descriptionText: {
    padding: 10,
    fontSize: 18,
    color: "#808080",
    marginBottom: 15,
  },
  masonryList: {
    flex: 1,
  },
});
