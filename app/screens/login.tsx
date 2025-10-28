import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { RootStackParamList } from "../../types";
import Constants from "expo-constants";

type LoginNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "LoginPage"
>;


WebBrowser.maybeCompleteAuthSession();

const API_BASE_URL = 'https://vocabapp-backend-3ec74c7b267c.herokuapp.com';

const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
};


export default function LoginPage() {
  const navigation = useNavigation<LoginNavigationProp>();
  const redirectUri = AuthSession.makeRedirectUri();

  console.log("Expo Redirect URI:", redirectUri);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      androidClientId: "961378291358-p7m9up24hq8mv9b3hljiqo68gk2tm1tb.apps.googleusercontent.com",
      redirectUri: redirectUri,
    },
    { native: 'com.anonymous.MyVocabVault://',}
  );

   useEffect(() => {
    if (response?.type === "success") {
      console.log("Google OAuth Success:", response.authentication?.accessToken);
      handleGoogleSignIn(response.authentication?.accessToken);
    } else if (response?.type === "error") {
      Alert.alert("Error", "Failed to sign in with Google");
    }
  }, [response]);

  const handleGoogleSignIn = async (token?: string) => {
    if (!token) return;
    setLoading(true);

    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const googleUser = await res.json();
      console.log("Google User Info:", googleUser);

      await registerOrLoginWithGoogle(googleUser);
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      Alert.alert("Error", "Unable to complete Google Sign-In");
    } finally {
      setLoading(false);
    }
  };

  const registerOrLoginWithGoogle = async (googleUser: any) => {
    const email = googleUser.email;
    const name = googleUser.name || "GoogleUser";
    const password = googleUser.id; 
    // placeholder password

    try {
      console.log("Attempt backend login:", { email, password });

      // Try to log in first
      const loginRes = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();

      if (loginRes.ok) {
        console.log("Existing user logged in:", loginData);
        await AsyncStorage.setItem("userID", loginData.userId?.toString() || "");
        await AsyncStorage.setItem("userEmail", email);
        navigation.navigate("LandingPage", { userID: email });
        Alert.alert("Welcome back", `Hello ${name}!`);
        return;
      }

      // If not found → register new user
      if (loginData.error?.toLowerCase().includes("not found")) {
        console.log("User not found → registering new user");

        const regRes = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            securityQuestion: "What provider do you use to sign in?",
            securityAnswer: "Google",
          }),
        });

        const regData = await regRes.json();

        if (regRes.ok) {
          console.log("New user registered:", regData);
          await AsyncStorage.setItem("userID", regData.userId?.toString() || "");
          await AsyncStorage.setItem("userEmail", email);
          navigation.navigate("LandingPage", { userID: email });
          Alert.alert("Welcome", `Your account has been created, ${name}!`);
        } else {
          console.error("Registration failed:", regData);
          Alert.alert("Error", regData.error || "Failed to register new user.");
        }
      } else {
        Alert.alert("Error", loginData.error || "Login failed.");
      }
    } catch (err) {
      console.error("API error:", err);
      Alert.alert("Error", "Could not connect to server.");
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    console.log("Attempting login with email:", email);

    try {
      console.log("Calling URL:", API_ENDPOINTS.LOGIN);
      
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password
        }),
      });

      console.log(" Response status:", response.status);
      const data = await response.json();
      console.log(" Login response:", JSON.stringify(data, null, 2));
      console.log("RESPONSE: ", response);

      if (response.ok) {
        console.log(" Login successful! UserID:", data.userId);
        (navigation as any).navigate("LandingPage", { userID: data.userId });
      } else {
        Alert.alert("Login Failed", data.error || "An error occurred");
      }
    } catch (error) {
      console.error(" Login error:", error);
      Alert.alert("Connection Error", "Could not connect to server. Make sure the backend is running on port 8080.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        editable={!loading}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword}
        autoCapitalize="none"
        editable={!loading}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#FF5733" style={{ marginTop: 20 }} />
      ) : (
        <>
          <Button title="Log In" onPress={handleLogin} color="#FF5733" />
          <View style={{ marginVertical: 10 }} />
          <Button title="Sign in with Google" color="#DB4437" onPress={() => promptAsync()} />
        </>
      )}
      <TouchableOpacity onPress={() => (navigation as any).navigate("ForgotPassword")}> 
        <Text style={{ color: "blue", marginTop: 10 }}>Forgot/Reset Password?</Text> 
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#adba95",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
});