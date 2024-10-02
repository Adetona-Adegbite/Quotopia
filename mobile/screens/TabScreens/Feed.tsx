import React from "react";
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
} from "react-native";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import image1 from "../../assets/post-pictures/1.jpg";
import image2 from "../../assets/post-pictures/2.jpg";
import image3 from "../../assets/post-pictures/3.png";
import image4 from "../../assets/post-pictures/4.jpg";
import image5 from "../../assets/post-pictures/5.jpg";

export default function HomePage() {
  const route = useRoute();
  const { name } = route;

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={styles.page}>
        {/* Header with the app name and pen icon */}
        <View style={styles.header}>
          <Text style={styles.appName}>Quotopia</Text>
          <TouchableOpacity style={styles.penIcon}>
            <Feather name="edit-3" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView>
          {posts.map((post) => (
            <View key={post.id} style={styles.postContainer}>
              <View style={styles.userInfo}>
                <Image
                  source={{ uri: post.profilePic }}
                  style={styles.profilePic}
                />
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{post.username}</Text>
                  <Text style={styles.timePosted}>{post.timePosted}</Text>
                </View>
              </View>
              <Text style={styles.caption}>{post.caption}</Text>
              {post.postImage && (
                <Image source={post.postImage} style={styles.postImage} />
              )}
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton}>
                  <FontAwesome
                    name={post.liked ? "heart" : "heart-o"}
                    size={24}
                    color={post.liked ? "#5FB49C" : "black"}
                  />
                  <Text style={styles.actionText}>{post.likes}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
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
});
