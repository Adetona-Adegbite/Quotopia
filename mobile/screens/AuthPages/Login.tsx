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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Entypo from "@expo/vector-icons/Entypo";

// @ts-ignore
const LoginPage: React.FC = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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
    // if (!email || !password) {
    //   Alert.alert("Please fill in all fields.");
    //   return;
    // }
    // Add your login logic here (API calls, etc.)
    navigation.navigate("Main");
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={styles.container}>
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
              navigation.navigate("Login");
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    padding: 30,
    paddingTop: 100,
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
