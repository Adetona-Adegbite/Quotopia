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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// @ts-ignore
const LoginPage: React.FC = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://172.20.10.3:3030/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data);

        // Login successful
        await AsyncStorage.setItem("accessToken", data.accessToken);
        await AsyncStorage.setItem("refreshToken", data.refreshToken);
        await AsyncStorage.setItem("userId", JSON.stringify(data.user));
        // Navigate to the main page
        navigation.navigate("Main");
      } else {
        // Handle login errors
        Alert.alert("Login failed", data.error);
      }
    } catch (error) {
      Alert.alert("An error occurred", error.message);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={{ fontWeight: "bold", fontSize: 24, marginBottom: 15 }}>
          Login to Your Account
        </Text>
        <Text
          style={{
            fontWeight: "500",
          }}
        >
          Don't have an account?
          <Pressable
            onPress={() => {
              navigation.navigate("Register");
            }}
          >
            <Text
              style={{
                color: "#5FB49C",
                fontWeight: "bold",
                // borderWidth: 1,
                position: "relative",
                top: 4,
                left: 2,
              }}
            >
              Register
            </Text>
          </Pressable>
        </Text>

        <TextInput
          style={[styles.input, { marginTop: 100 }]}
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
    paddingBottom: 350,
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

export default LoginPage;
