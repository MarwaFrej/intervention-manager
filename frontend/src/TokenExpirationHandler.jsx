import { useEffect } from "react";
import useAuthStore from "../src/stores/authStore";

const TokenExpirationHandler = () => {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const isTokenExpired = useAuthStore((state) => state.isTokenExpired);

  useEffect(() => {
    if (!token) return;

    const checkToken = () => {
      if (isTokenExpired()) {
        logout();
      }
    };

    checkToken();

    const interval = setInterval(checkToken, 10000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkToken();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [token, logout, isTokenExpired]);

  return null;
};

export default TokenExpirationHandler;