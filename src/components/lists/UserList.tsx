"use client"
import { useEffect, useState } from "react";
import socket from "@utils/socketClient"
import { useErrorHandler } from "@components/providers/ErrorContext";
import handleError from "@utils/handleError";
import { useLoading } from "@components/providers/LoadingContext";
import { fetchAllUsers } from "@app/requests";

const UserList = () => {
  const [userNames, setUserNames] = useState([]);
  const { startLoading, stopLoading } = useLoading();
  const { addError } = useErrorHandler();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        startLoading();
        const response = await fetchAllUsers();
        setUserNames(response.data.users.map(u => u.name));
      } catch (error: unknown) {
        addError(handleError(error));
      } finally {
        stopLoading();
      }
  };

  fetchUsers();
    socket.on("userListUpdate", (names) => {
      setUserNames(names);
    });
    return () => {
      socket.off("userListUpdate");
    };
  }, [addError, startLoading, stopLoading]);

  return (
    <div className="relative z-50 bg-black text-neutral-50 p-16">
      <h1 className="font-black">User List</h1>
      <ul>
        {userNames.map((name,i) => (
          <li key={`user-${i}`}>{name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
 