import { Text, TouchableOpacity, View } from "react-native";

export default function Task({ task, onComplete }) {
  return (
    <View className="flex-row items-center p-4 border-b border-gray-300">
      <TouchableOpacity
        className="flex-row items-center"
        onPress={() => onComplete(task.id)}
      >
        <Text className="text-gray-400 mr-2">
          {task.completed ? "✅" : "❌"}
        </Text>
        <Text className="text-black">{task.name}</Text>
      </TouchableOpacity>
    </View>
  );
}
