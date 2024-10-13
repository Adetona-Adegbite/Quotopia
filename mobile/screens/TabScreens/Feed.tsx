import React, { useCallback, useEffect, useState } from "react";
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
  Alert,
  RefreshControl,
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
import supabase from "../../tools/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../tools/axiosinstance";
import { url } from "../../tools/url";

const { width, height } = Dimensions.get("screen");
export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [images, setImages] = useState<string[]>([]);

  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  const [noMorePosts, setNoMorePosts] = useState(false);

  const fetchPosts = async (pageNumber: number) => {
    try {
      setLoadingPosts(true);
      const { data } = await axiosInstance.get(`/posts?page=${pageNumber}`);

      if (data.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...data]);
      } else {
        setNoMorePosts(true);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      Alert.alert("Error fetching posts", error.message);
    } finally {
      setLoadingPosts(false);
    }
  };
  useEffect(() => {
    const sendToken = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");

        const token = await AsyncStorage.getItem("notification-token");

        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axiosInstance.post("/notifications/save-token", {
          token,
          userId,
        });

        if (response.status === 200) {
          console.log("Token saved successfully");
        } else {
          console.error("Failed to save token", response.data);
        }
      } catch (error) {
        console.error("Error sending token:", error);
      }
    };

    const fetchImages = async () => {
      const { data, error } = await supabase.storage
        .from("post_pictures")
        .list("", {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });
      if (error) {
        console.log("Error fetching images:", error);
      } else {
        const imageUrls = data.map(
          (file) =>
            supabase.storage.from("post_pictures").getPublicUrl(file.name).data
              .publicUrl
        );
        setImages(imageUrls);
      }
    };
    fetchImages();
    sendToken();
  }, []);

  useEffect(() => {
    fetchPosts(page);
  }, [page]);
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setSelectedImage(null);
    setCaption("");
    if (!isModalVisible) {
      setImages(shuffleArray([...images])); // Clone and shuffle the images
    }
  };
  const selectImage = (index, image) => {
    setSelectedImageUrl(image);
    setSelectedImage((prev) => (prev === index ? null : index));
  };

  const postSimulation = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("userId");
      const postData = {
        userId,
        imageUrl: selectedImageUrl,
        caption,
      };
      await axiosInstance.post("/posts", postData);

      setLoading(false);
      setCaption("");
      toggleModal();
      setSnackbarVisible(true);
      setSelectedImage(null);
      setPosts([]);
      setPage(0);
      fetchPosts(0);
    } catch (e: any) {
      Alert.alert("An error occurred. Try again later", e.message);
    } finally {
      setLoading(false);
    }
  };

  const likeHandler = async (postId: string, liked: boolean) => {
    try {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likedByUser: !liked,
                likeCount: liked ? post.likeCount - 1 : post.likeCount + 1,
              }
            : post
        )
      );

      const userId = await AsyncStorage.getItem("userId");
      const endpoint = liked
        ? `/likes/${postId}/unlike`
        : `/likes/${postId}/like`;

      await axiosInstance.post(endpoint, { userId });
    } catch (error) {
      console.log("Error updating like:", error);
      Alert.alert("An error occurred while updating the like status.");
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPosts([]);
    setPage(0);
    setNoMorePosts(false);
    await fetchPosts(0);
    setRefreshing(false);
  }, []);

  const loadMorePosts = async () => {
    if (!loadingPosts && !noMorePosts) {
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchPosts(nextPage);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.appName}>Quotopia</Text>
          <TouchableOpacity style={styles.penIcon} onPress={toggleModal}>
            <Feather name="edit-3" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {loadingPosts && page === 0 ? (
          <ActivityIndicator size="large" color="#5FB49C" />
        ) : (
          <FlatList
            contentContainerStyle={{ paddingBottom: 70 }}
            showsVerticalScrollIndicator={false}
            data={posts}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onEndReached={loadMorePosts}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              loadingPosts ? (
                <View style={{ paddingVertical: 20 }}>
                  <ActivityIndicator size="small" color="red" />
                </View>
              ) : noMorePosts ? (
                <Text style={{ textAlign: "center", color: "#888" }}>
                  No more posts to load
                </Text>
              ) : null
            }
            renderItem={({ item }) => {
              return (
                <View key={item.id} style={styles.postContainer}>
                  <View style={styles.userInfo}>
                    <Image
                      source={{
                        uri: `http://${url}/${item.user.profile_pic}`,
                      }}
                      style={styles.profilePic}
                    />
                    <View style={styles.userDetails}>
                      <Text style={styles.userName}>@{item.user.username}</Text>
                      <Text style={styles.timePosted}>{item.timeAgo}</Text>
                    </View>
                  </View>
                  <Text style={styles.caption}>{item.caption}</Text>
                  {item.imageUrl && (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.postImage}
                    />
                  )}
                  <View style={styles.actions}>
                    <TouchableOpacity
                      onPress={() => likeHandler(item.id, item.likedByUser)}
                      style={styles.actionButton}
                    >
                      <FontAwesome
                        name={item.likedByUser ? "heart" : "heart-o"}
                        size={24}
                        color={item.likedByUser ? "#5FB49C" : "black"}
                      />
                      <Text style={styles.actionText}>{item.likeCount}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        )}

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
                  placeholder="Type kind words here..."
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
                    onPress={() => selectImage(index, image)}
                  >
                    <Image source={{ uri: image }} style={styles.imageItem} />
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

              <TouchableOpacity
                onPress={postSimulation}
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
    height: "85%",
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
