"use client"
import { useEffect, useState } from "react";
import socket from "@utils/socketClient"
import axios from "axios";
import { getAuthToken } from "src/lib/auth/getAuthToken";
import { useErrorHandler } from "@components/providers/ErrorContext";
import handleError from "@utils/handleError";

const UserList = () => {
  const [userNames, setUserNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addError } = useErrorHandler();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
          const response = await axios.get(`/api/users`, { headers: { Authorization: `Bearer ${getAuthToken()}` } });
          setUserNames(response.data.users.map(u => u.name));


      } catch (error: unknown) {
        addError(handleError(error));
      } finally {
          setLoading(false);
      }
  };

  fetchUsers();
    socket.on("userListUpdate", (names) => {
      setUserNames(names);
    });
    return () => {
      socket.off("userListUpdate");
    };
  }, [addError]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="relative z-50 bg-black text-neutral-50 p-16">
      <h1 className="font-black">User List</h1>
      <ul>
        {userNames.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
 