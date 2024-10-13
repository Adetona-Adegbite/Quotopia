import React, { useLayoutEffect, useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";
// @ts-ignore

import image1 from "../../assets/1.jpg";
// @ts-ignore

import image2 from "../../assets/2.jpg";
// @ts-ignore

import profile from "../../assets/tona_tech.jpeg";
import axiosInstance from "../../tools/axiosinstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "../../tools/url";
// @ts-ignore
export default function ProfilePage({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [userData, setUserData] = useState({ userPosts: [], totalLikes: 0 });

  useLayoutEffect(() => {
    async function getUserData() {
      setLoading(true);
      try {
        const userId = await AsyncStorage.getItem("userId");
        const response = await axiosInstance.get(`/posts/user/${userId}`);
        console.log(response.data);

        setUserData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getUserData();
  }, []);

  const toggleNotifications = async (value) => {
    setNotificationsEnabled(value);

    try {
      const userId = await AsyncStorage.getItem("userId");
      await axiosInstance.put(`/user/update-preferences`, {
        notificationsEnabled: value,
        userId: userId,
      });
    } catch (error) {
      console.error("Error updating notification preferences:", error);
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const renderPost = ({ item }) => {
    const handleLike = async (postId: any, likedByUser: any) => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        console.log(likedByUser);

        if (likedByUser) {
          await axiosInstance.post(`/likes/${postId}/unlike`, { userId });
        } else {
          await axiosInstance.post(`/likes/${postId}/like`, { userId });
        }

        // Update local state to reflect the new like status
        setUserData((prevData: any) => {
          const updatedPosts = prevData.userPosts.map((post: any) => {
            if (post.id === postId) {
              return {
                ...post,
                likedByUser: !likedByUser,
                likeCount: likedByUser
                  ? post.likeCount - 1
                  : post.likeCount + 1,
              };
            }
            return post;
          });
          return { ...prevData, userPosts: updatedPosts };
        });
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <View key={item.id} style={styles.postContainer}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: `http://${url}/${item.user.profile_pic}`,
            }}
            style={{ width: 50, height: 50, borderRadius: 50, marginRight: 10 }}
          />
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.userName}>You</Text>
            <Text style={styles.timePosted}>{item.timeAgo}</Text>
          </View>
        </View>
        <Text style={styles.caption}>{item.caption}</Text>
        {item.imageUrl && (
          <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
        )}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => handleLike(item.id, item.likedByUser)}
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
  };

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
          <Image
            source={{
              uri: `http://${url}/${userData.userPosts[0]?.user.profile_pic}`,
            }}
            style={styles.profilePic}
          />
          <View style={styles.usernameContainer}>
            <Text style={styles.username}>
              @{userData.userPosts[0]?.user.username}
            </Text>
            <View style={styles.metrics}>
              <View style={styles.metricContainer}>
                <Text style={styles.metricCount}>
                  {userData.userPosts.length}
                </Text>
                <Text style={styles.metricLabel}>Posts</Text>
              </View>
              <View style={styles.metricContainer}>
                <Text style={styles.metricCount}>{userData.totalLikes}</Text>
                <Text style={styles.metricLabel}>Likes</Text>
              </View>
            </View>
          </View>
        </View>

        {loading ? ( // Display loading indicator if loading
          <ActivityIndicator size="large" color="#5FB49C" />
        ) : (
          <FlatList
            contentContainerStyle={{ paddingBottom: 70 }}
            data={userData.userPosts}
            showsVerticalScrollIndicator={false}
            renderItem={renderPost}
            keyExtractor={(item) => item.id.toString()}
          />
        )}

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
                <Text style={styles.switchLabel}>Notifications Enabled</Text>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={(value) => toggleNotifications(value)}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  toggleModal();
                  AsyncStorage.removeItem("userId");
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
