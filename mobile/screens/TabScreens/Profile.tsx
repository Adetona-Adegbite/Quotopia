import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  Switch,
} from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";
// @ts-ignore

import image1 from "../../assets/1.jpg";
// @ts-ignore

import image2 from "../../assets/2.jpg";
// @ts-ignore

import profile from "../../assets/tona_tech.jpeg";
// @ts-ignore

export default function ProfilePage({ navigation }) {
  // Sample user data
  const userData = {
    profilePic: profile,
    username: "Tona Tech",
    postCount: 15,
    totalLikes: 250,
    posts: [
      {
        id: 1,
        profilePic: profile,
        username: "JohnDoe",
        timePosted: "2 hours ago",
        caption: "Just posted my first reel!",
        postImage: image1,
        liked: true,
        likes: 20,
      },
      {
        id: 3,
        profilePic: profile,
        username: "JohnDoe",
        timePosted: "1 day ago",
        caption: "Learning React Native!",
        postImage: null,
        liked: true,
        likes: 30,
      },
      {
        id: 2,
        profilePic: profile,
        username: "JohnDoe",
        timePosted: "5 hours ago",
        caption: "Had a great day at the beach!",
        postImage: image2,
        liked: false,
        likes: 15,
      },
    ],
  };

  // State for modal and snackbar
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  // @ts-ignore

  const renderPost = ({ item }) => (
    <View key={item.id} style={styles.postContainer}>
      <View style={styles.userInfo}>
        <Image
          source={item.profilePic}
          style={{ width: 50, height: 50, borderRadius: 50, marginRight: 10 }}
        />
        {/* @ts-ignore */}
        <View style={styles.userDetails}>
          <Text style={styles.userName}>You</Text>
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.appName}>Profile</Text>
          <TouchableOpacity style={styles.settingsIcon} onPress={toggleModal}>
            <Feather name="settings" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <Image source={userData.profilePic} style={styles.profilePic} />
          <View style={styles.usernameContainer}>
            <Text style={styles.username}>{userData.username}</Text>
            <View style={styles.metrics}>
              <View style={styles.metricContainer}>
                <Text style={styles.metricCount}>{userData.postCount}</Text>
                <Text style={styles.metricLabel}>Posts</Text>
              </View>
              <View style={styles.metricContainer}>
                <Text style={styles.metricCount}>{userData.totalLikes}</Text>
                <Text style={styles.metricLabel}>Likes</Text>
              </View>
            </View>
          </View>
        </View>

        <FlatList
          contentContainerStyle={{ paddingBottom: 70 }}
          data={userData.posts}
          showsVerticalScrollIndicator={false}
          renderItem={renderPost}
          keyExtractor={(item) => item.id.toString()}
        />

        {/* Modal for settings */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={toggleModal}
        >
          <View style={styles.modalContainer}>
            <Pressable style={styles.modalOverlay} onPress={toggleModal} />
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Settings</Text>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Turn Off Notifications</Text>
                <Switch
                  value={!notificationsEnabled}
                  onValueChange={() => setNotificationsEnabled((prev) => !prev)}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  toggleModal();
                  navigation.navigate("Landing");
                }}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  settingsIcon: {
    padding: 10,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
  },
  usernameContainer: {
    flex: 1,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  metrics: {
    flexDirection: "row",
    gap: 50,
  },
  metricContainer: {
    alignItems: "center",
  },
  metricCount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  metricLabel: {
    fontSize: 14,
    color: "#888",
  },
  postContainer: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(2, 61, 2, 0.2)",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userName: {
    fontWeight: "bold",
  },
  timePosted: {
    fontSize: 12,
    color: "#888",
  },
  caption: {
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
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalOverlay: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "50%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  switchLabel: {
    fontSize: 18,
  },
  closeButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "red",
    fontWeight: "bold",
  },
  snackbar: {
    bottom: 0,
    position: "absolute",
    width: "100%",
  },
});
