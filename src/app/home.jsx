import Task from "@components/Task";
import { auth, db } from "@src/services/firebase";
import { useRouter } from "expo-router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AddCircle from "@assets/AddCircle";

const HomeScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskName, setTaskName] = useState("");

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setUser(currentUser);
    setLoading(true);

    const userTasksRef = collection(db, `users/${currentUser.uid}/tasks`);

    const unsubscribe = onSnapshot(
      userTasksRef,
      (querySnapshot) => {
        const newTasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(newTasks);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const onComplete = async (taskId) => {
    try {
      const task = tasks.find((task) => task.id === taskId);
      if (!task) return;

      const taskRef = doc(db, `users/${user.uid}/tasks`, task.id);
      await setDoc(taskRef, { ...task, completed: !task.completed });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const onDelete = async (taskId) => {
    try {
      await deleteDoc(doc(db, `users/${user.uid}/tasks`, taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const onAddTask = async () => {
    if (!taskName.trim()) return;

    try {
      const task = {
        name: taskName,
        completed: false,
      };
      const userTasksRef = collection(db, `users/${user.uid}/tasks`);
      await addDoc(userTasksRef, task);
      setTaskName("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <View className="flex-1 justify-center p-4">
      <Text className="text-3xl font-bold text-center mt-3 mb-8">Tasks</Text>
      <View className="flex-row justify-between items-center mb-4">
        <TextInput
          value={taskName}
          onChangeText={setTaskName}
          placeholder="Task Name"
          className="p-4 border border-gray-300 rounded-lg mb-4 flex-1 mr-2"
          onSubmitEditing={onAddTask}
        />
        <TouchableOpacity
          onPress={onAddTask}
          className="flex-row bg-blue-500 p-4 rounded-lg mb-4 items-center"
        >
          <AddCircle fill="#fff" />
          <Text className="pl-2 text-white text-center font-bold">
            Add Task
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <Task task={item} onComplete={onComplete} onDelete={onDelete} />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="pt-6 flex-1 h-full items-center justify-center">
            <Text className="font-semibold text-xl">No tasks to do.</Text>
          </View>
        }
      />
    </View>
  );
};

export default HomeScreen;
