import { auth } from "@src/firebase/firebase";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/home");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <View className="flex-1 justify-center p-4 bg-white">
      <Text className="text-3xl font-bold text-center mb-8">Login</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        className="p-4 border border-gray-300 rounded-lg mb-4"
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        className="p-4 border border-gray-300 rounded-lg mb-4"
      />

      {error && <Text className="text-red-500 text-center mb-4">{error}</Text>}

      <TouchableOpacity
        onPress={handleLogin}
        className="bg-blue-500 p-4 rounded-lg mb-4"
      >
        <Text className="text-white text-center font-bold">Login</Text>
      </TouchableOpacity>

      <View className="flex-row justify-center mt-4">
        <Text className="mr-2">Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text className="text-blue-500">Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
