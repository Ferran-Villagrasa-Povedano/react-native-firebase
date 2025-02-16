import { Image } from "react-native";

export default function Avatar({ user }) {
  return (
    <Image
      source={{
        uri: `https://avatar.iran.liara.run/username?username=${user.email}`,
      }}
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
      }}
    />
  );
}
