// context/UserContext.js
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // Effect to load user from localStorage on initial component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem("user"); // Clear invalid data if parsing fails
      }
    }
  }, []); // Empty dependency array: runs only once on initial mount

  // Effect to save user to localStorage whenever the 'user' state changes
  useEffect(() => {
    if (user) {
      // If user data exists, stringify and save it to localStorage
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      // If user becomes null (e.g., on logout), remove it from localStorage
      localStorage.removeItem("user");
    }
  }, [user]); // Dependency array: this effect runs every time 'user' state changes

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}