import { Text, TouchableOpacity, View } from "react-native";

import CheckCircle from "@assets/CheckCircle";
import Delete from "@assets/Delete";
import RadioButtonUnchecked from "@assets/RadioButtonUnchecked";

export default function Task({ task, onComplete, onDelete }) {
  return (
    <View className="flex-row items-center justify-between p-4 border-b border-gray-300">
      <TouchableOpacity
        className="flex-row items-center flex-1"
        onPress={() => onComplete(task.id)}
      >
        <Text className="text-gray-400 mr-2">
          {task.completed ? (
            <CheckCircle fill="#3f3f3f" />
          ) : (
            <RadioButtonUnchecked fill="#3f3f3f" />
          )}
        </Text>
        <Text className={`text-black ${task.completed && "line-through"}`}>
          {task.name}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-row items-center"
        onPress={() => onDelete(task.id)}
      >
        <Delete fill="#3f3f3f" />
      </TouchableOpacity>
    </View>
  );
}
