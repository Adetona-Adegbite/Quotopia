import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Entypo from "@expo/vector-icons/Entypo";

// @ts-ignore
const RegisterPage: React.FC = ({ navigation }) => {
  const [firstName, setFirstName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    navigation.navigate("Main");
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={{ fontWeight: "bold", fontSize: 24, marginBottom: 15 }}>
          Create an Account
        </Text>
        <Text style={{ fontWeight: "500" }}>
          Already have an account?
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>Login</Text>
          </Pressable>
        </Text>
        <View style={styles.profileContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>Picture</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.pencilButton}
            onPress={handleImagePick}
          >
            <Entypo name="pencil" size={24} color="#515851" />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Firstname"
          placeholderTextColor="#515851"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#515851"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#515851"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#515851"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* </TouchableWithoutFeedback>
      </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    padding: 30,
    paddingTop: 100,
    paddingBottom: 300,
  },
  profileContainer: {
    position: "relative",
    marginBottom: 20,
    marginTop: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#aaa",
  },
  pencilButton: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 5,
  },
  loginText: {
    color: "#5FB49C",
    fontWeight: "bold",
    position: "relative",
    top: 4,
    left: 2,
  },
  input: {
    height: 60,
    width: "100%",
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#5FB49C",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default RegisterPage;
