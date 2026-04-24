import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    
    const token = localStorage.getItem("token");
    return token ? { token } : null;
  });

  const loginUser = (token) => {
    localStorage.setItem("token", token);
    setUser({ token }); // 
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};