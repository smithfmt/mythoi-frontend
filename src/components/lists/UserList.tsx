"use client"
import { useEffect, useState } from "react";
import socket from "@utils/socketClient"
import axios from "axios";
import { getAuthToken } from "@utils/getAuthToken";

const UserList = () => {
  const [userNames, setUserNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
          const response = await axios.get(`/api/users`, { headers: { Authorization: `Bearer ${getAuthToken()}` } });
          setUserNames(response.data.users.map(u => u.name));


      } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
              setError(error.response?.data?.message || "An error occurred while fetching the lobby");
          } else if (error instanceof Error) {
              setError(error.message);
          } else {
              setError("An unknown error occurred");
          }
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
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="relative z-50 text-red-500">{error}</p>;

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
 