// useUserId.ts

import { useEffect, useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface decodedJWT extends JwtPayload {
    id: number,
}

const useUserId = () => {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const getUserIdFromToken = () => {
      const token = localStorage.getItem("token"); 
      if (token) {
        try {
          const decoded: decodedJWT = jwtDecode(token); 
          setUserId(decoded.id);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };

    getUserIdFromToken();
  }, []);

  return userId;
};

export default useUserId;
