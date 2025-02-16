import { Image } from "react-native";

export default function Avatar({ user }) {
  return (
    <Image
      source={{
        uri: `https://avatar.iran.liara.run/username?username=${user.displayName}`,
      }}
      className="rounded-full w-10 h-10"
      alt={user.displayName}
    />
  );
}
