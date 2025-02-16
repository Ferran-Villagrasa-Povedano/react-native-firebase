import Avatar from "@components/Avatar";
import "@src/global.css";
import { auth } from "@src/services/firebase";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

export default function Layout() {
  const [user, setUser] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  const router = useRouter();
  const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);

  const handleLogout = () => {
    auth.signOut();
    setDropdownVisible(false);
    router.replace("/login");
  };

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#3f3f3f" },
          headerTintColor: "white",
          headerTitle: "Todo List",
          headerRight: () =>
            user && (
              <TouchableOpacity
                onPress={toggleDropdown}
                style={{ paddingRight: 10 }}
              >
                <Avatar user={user} />
              </TouchableOpacity>
            ),
        }}
      />

      <Modal
        transparent
        animationType="fade"
        visible={isDropdownVisible}
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/20 justify-center items-center"
          onPress={() => setDropdownVisible(false)}
        >
          <View className="absolute top-16 right-5 bg-white p-4 rounded-lg w-48 shadow-lg">
            <Text className="mb-3 font-semibold text-black">
              {user?.displayName}
            </Text>
            <Text className="mb-3 font-semibold text-black">{user?.email}</Text>
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-blue-500 p-2 rounded-lg"
            >
              <Text className="text-white text-center font-bold">Log out</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
