import Task from "@components/Task";
import { auth, db } from "@src/firebase/firebase";
import { useRouter } from "expo-router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
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

  const tasksRef = collection(db, "tasks");

  useEffect(() => {
    const currentUser = auth.currentUser;
    setUser(currentUser);

    setLoading(true);
    const q = query(tasksRef, where("uid", "==", currentUser.uid));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const newTasks = [];
        querySnapshot.forEach((doc) => {
          const task = doc.data();
          task.id = doc.id;
          newTasks.push(task);
        });
        setTasks(newTasks);
        setLoading(false);
      },
      (error) => {
        console.log(error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user]);

  const onComplete = async (taskId) => {
    try {
      const task = tasks.find((task) => task.id === taskId);
      task.completed = !task.completed;
      await setDoc(doc(db, "tasks", task.id), task);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const onDelete = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const onAddTask = async (taskName) => {
    if (!taskName) {
      return;
    }

    try {
      const task = {
        name: taskName,
        completed: false,
        uid: user.uid,
      };
      await addDoc(tasksRef, task);
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
          onSubmitEditing={() => onAddTask(taskName)}
        />
        <TouchableOpacity
          onPress={() => onAddTask(taskName)}
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
