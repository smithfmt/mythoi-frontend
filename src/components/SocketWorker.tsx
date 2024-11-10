"use client"
import { useEffect } from "react";

const SocketWorker = () => {
    useEffect(() => {
        // Call the socket API route to ensure the server initializes
        fetch("/api/socket")
          .then((response) => response.json())
          .catch((error) => console.error("Error initializing socket:", error));
      }, []);
      
    return <></>
}

export default SocketWorker;