import Task from "@components/Task";
import { auth, db } from "@src/firebase/firebase";
import { useRouter } from "expo-router";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

const HomeScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const tasksRef = collection(db, "tasks");

  useEffect(() => {
    const currentUser = auth.currentUser;
    setUser(currentUser);

    setLoading(true);
    const q = query(
      tasksRef,
      where("uid", "==", currentUser.uid)
      // orderBy("createdAt", "desc")
    );

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

  //r4lHWwC66gFxySyd5uCh
  return (
    // <Task task={tasks[0]} onComplete={onComplete} />

    <View className="">
      <Text className="text-3xl font-bold text-center mt-3 mb-8">Tasks</Text>
      <FlatList
        data={tasks}
        renderItem={({ item }) => <Task task={item} onComplete={onComplete} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center">
            <Text>No tasks</Text>
          </View>
        }
      />
    </View>

    // test@gmail.com
  );
};

export default HomeScreen;
