import { auth } from "@src/firebase/firebase";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const HomeScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    setUser(currentUser);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.error("Error signing out: ", err);
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-4 bg-white">
      <Text className="text-3xl font-bold mb-4">
        {user ? `Hello, ${user.displayName || user.email}` : "Loading..."}
      </Text>

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-500 p-4 rounded-lg"
      >
        <Text className="text-white text-center font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
