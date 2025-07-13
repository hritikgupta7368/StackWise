import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Delay navigation to ensure the router is mounted
    const timeout = setTimeout(() => {
      router.replace("/home");
    }, 0); // wait 1 tick

    return () => clearTimeout(timeout);
  }, []);

  return null;
}
