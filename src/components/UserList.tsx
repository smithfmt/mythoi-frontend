"use client"
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(process.env.EXPRESS_API_URL || "http://localhost:5000");

const UserList = () => {
  const [userNames, setUserNames] = useState([]);

  useEffect(() => {
    socket.on("userListUpdate", (names) => {
        console.log("WE HEAR YOU!")
      setUserNames(names);
    });
    return () => {
      socket.off("userListUpdate");
    };
  }, []);

  return (
    <div className="relative z-50 bg-black text-neutral-50 p-16">
      <h1>User List</h1>
      <ul>
        {userNames.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
 