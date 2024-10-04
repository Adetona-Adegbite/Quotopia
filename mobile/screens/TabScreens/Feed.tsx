import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
  Dimensions,
  FlatList,
} from "react-native";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
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
// @ts-ignore

import { ActivityIndicator, Snackbar } from "react-native-paper";

const { width, height } = Dimensions.get("screen");

export default function HomePage() {
  // Sample posts with some having no images
  const posts = [
    {
      id: 1,
      username: "JohnDoe",
      timePosted: "2 hours ago",
      caption: "Had a great time at the beach today!",
      postImage: image1,
      profilePic: "https://via.placeholder.com/50",
      likes: 120,
      comments: 30,
      purchases: 5,
      liked: true,
    },
    {
      id: 2,
      username: "JaneSmith",
      timePosted: "3 hours ago",
      caption: "Loving this new book I'm reading.",
      postImage: null, // No image for this post
      profilePic: "https://via.placeholder.com/50",
      likes: 89,
      comments: 10,
      liked: false,

      purchases: 2,
    },
    {
      id: 3,
      username: "MikeRoss",
      timePosted: "5 hours ago",
      caption: "Check out my new car!",
      postImage: image2,
      profilePic: "https://via.placeholder.com/50",
      likes: 230,
      comments: 45,
      purchases: 12,
      liked: true,
    },
    {
      id: 4,
      username: "RachelZane",
      timePosted: "7 hours ago",
      caption: "My new artwork is finally complete.",
      postImage: null, // No image for this post
      profilePic: "https://via.placeholder.com/50",
      likes: 170,
      comments: 20,
      liked: false,
      purchases: 8,
    },
    {
      id: 5,
      username: "HarveySpecter",
      timePosted: "8 hours ago",
      caption: "Winning is everything.",
      postImage: image4,
      profilePic: "https://via.placeholder.com/50",
      likes: 320,
      comments: 60,
      purchases: 15,
      liked: false,
    },
    {
      id: 6,
      username: "HarveySpecter",
      timePosted: "8 hours ago",
      caption: "Winning is everything.",
      postImage: image3,
      profilePic: "https://via.placeholder.com/50",
      likes: 320,
      comments: 60,
      purchases: 15,
      liked: true,
    },
    {
      id: 7,
      username: "HarveySpecter",
      timePosted: "8 hours ago",
      caption: "Winning is everything.",
      postImage: image5,
      profilePic: "https://via.placeholder.com/50",
      likes: 320,
      comments: 60,
      purchases: 15,
      liked: true,
    },
  ];
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const images = [image1, image2, image3, image4, image5];

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setSelectedImage(null);
    setCaption("");
  };
  // @ts-ignore

  const selectImage = (index) => {
    setSelectedImage((prev) => (prev === index ? null : index));
  };
  const postSimulation = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCaption("");
      toggleModal();
      setSnackbarVisible(true);
    }, 1500);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={styles.page}>
        {/* Header with the app name and pen icon */}
        <View style={styles.header}>
          <Text style={styles.appName}>Quotopia</Text>
          <TouchableOpacity style={styles.penIcon} onPress={toggleModal}>
            <Feather
              name="edit-3"
              size={24}
              color="black"
              // onPress={toggleModal}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          contentContainerStyle={{ paddingBottom: 70 }}
          showsVerticalScrollIndicator={false}
          data={posts}
          renderItem={({ item }) => {
            return (
              <View key={item.id} style={styles.postContainer}>
                <View style={styles.userInfo}>
                  <Image
                    source={{ uri: item.profilePic }}
                    style={styles.profilePic}
                  />
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{item.username}</Text>
                    <Text style={styles.timePosted}>{item.timePosted}</Text>
                  </View>
                </View>
                <Text style={styles.caption}>{item.caption}</Text>
                {item.postImage && (
                  <Image source={item.postImage} style={styles.postImage} />
                )}
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <FontAwesome
                      name={item.liked ? "heart" : "heart-o"}
                      size={24}
                      color={item.liked ? "#5FB49C" : "black"}
                    />
                    <Text style={styles.actionText}>{item.likes}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={toggleModal}
        >
          <View style={styles.modalContainer}>
            <Pressable
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor: "rgba(0,0,0,0.3)",
              }}
              onPress={toggleModal}
            ></Pressable>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create a Post</Text>
              <Text style={{ fontSize: 15, color: "#808080", marginBottom: 7 }}>
                You may also select a picture to improve the aesthetic!
              </Text>

              <View style={styles.quotationContainer}>
                <Text
                  style={[styles.quotationMark, { alignSelf: "flex-start" }]}
                >
                  "
                </Text>
                <TextInput
                  style={styles.input}
                  multiline
                  placeholder="Type your words here..."
                  value={caption}
                  onChangeText={setCaption}
                />
                <Text style={[styles.quotationMark, { alignSelf: "flex-end" }]}>
                  "
                </Text>
              </View>

              <ScrollView contentContainerStyle={styles.imageGrid}>
                {images.map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.imageWrapper}
                    onPress={() => selectImage(index)}
                  >
                    <Image source={image} style={styles.imageItem} />
                    {selectedImage === index && (
                      <Feather
                        name="check-circle"
                        size={24}
                        color="white"
                        style={styles.tickIcon}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Button to close modal */}
              <TouchableOpacity
                onPress={() => {
                  postSimulation();
                }}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>
                  {loading ? (
                    <ActivityIndicator animating={loading} color="#fff" />
                  ) : (
                    "Share"
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Snackbar
          visible={snackbarVisible}
          theme={{ colors: { primary: "green" } }}
          onDismiss={() => setSnackbarVisible(false)}
          duration={1500}
          style={{
            position: "absolute",
            bottom: height * 0.1,
            zIndex: 10,
            width: "110%",

            backgroundColor: "#5FB49C",
          }}
        >
          Your post has been shared with the world!❤️
        </Snackbar>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: Platform.OS == "ios" ? 20 : 45, // Adjusted for better visibility
    paddingHorizontal: Platform.OS == "ios" ? 30 : 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  appName: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
  },
  penIcon: {
    padding: 20,
    backgroundColor: "#5FB49C",
    borderRadius: 100,
  },
  searchBar: {
    backgroundColor: "#000000",
    height: 45,
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    marginBottom: 20,
  },
  postContainer: {
    padding: 8,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(2,61,2,0.2)",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userDetails: {
    flexDirection: "column",
  },
  userName: {
    color: "black",
    fontWeight: "bold",
  },
  timePosted: {
    color: "#888888",
    fontSize: 12,
  },
  caption: {
    color: "black",
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    color: "black",
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  quotationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  quotationMark: {
    fontSize: 38,
    color: "#5FB49C",
  },
  input: {
    width: "100%",
    // borderWidth: 1,
    // borderColor: "#ccc",
    padding: 18,
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 24,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    // gap: 5,
  },
  imageWrapper: {
    width: "49%",
    height: 150,
    marginBottom: 10,
    position: "relative",
  },
  imageItem: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  tickIcon: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#5FB49C",
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
