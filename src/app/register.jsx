import { auth, db } from "@src/firebase/firebase";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleRegister = async () => {
    if (auth.currentUser) {
      router.push("/home");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;
      const data = {
        id: uid,
        email,
        name,
      };

      await setDoc(doc(db, "users", uid), data);
      router.replace("/home");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-4 bg-white">
      <Text className="text-3xl font-bold text-center mb-8">Register</Text>

      <TextInput
        ref={usernameRef}
        value={name}
        onChangeText={setName}
        placeholder="User Name"
        className="p-4 border border-gray-300 rounded-lg mb-4"
        onSubmitEditing={() => emailRef.current.focus()}
      />

      <TextInput
        ref={emailRef}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        className="p-4 border border-gray-300 rounded-lg mb-4"
        onSubmitEditing={() => passwordRef.current.focus()}
      />

      <TextInput
        ref={passwordRef}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        className="p-4 border border-gray-300 rounded-lg mb-4"
        onSubmitEditing={() => confirmPasswordRef.current.focus()}
      />

      <TextInput
        ref={confirmPasswordRef}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password"
        secureTextEntry
        className="p-4 border border-gray-300 rounded-lg mb-4"
        onSubmitEditing={() => handleRegister()}
      />

      {error && <Text className="text-red-500 text-center mb-4">{error}</Text>}

      <TouchableOpacity
        onPress={handleRegister}
        className="bg-blue-500 p-4 rounded-lg mb-4"
      >
        <Text className="text-white text-center font-bold">Register</Text>
      </TouchableOpacity>

      <View className="flex-row justify-center mt-4">
        <Text className="mr-2">Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text className="text-blue-500">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
