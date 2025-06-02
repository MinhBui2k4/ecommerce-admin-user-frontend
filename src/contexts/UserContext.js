import { createContext, useContext, useState, useEffect } from "react";
import { GET_PROFILE } from "../api/apiService";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const isLoggedIn = !!localStorage.getItem("authToken");

  const fetchUserProfile = async () => {
    if (isLoggedIn) {
      try {
        const data = await GET_PROFILE();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [isLoggedIn]);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}