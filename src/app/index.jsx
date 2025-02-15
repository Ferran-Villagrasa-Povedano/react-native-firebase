import { auth } from "@src/firebase/firebase";
import { useRouter } from "expo-router";
import { useEffect } from "react";

const IndexScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        router.replace("/home");
      } else {
        router.replace("/login");
      }
    };

    const timeoutId = setTimeout(() => {
      checkAuthStatus();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [router]);

  return null;
};

export default IndexScreen;
