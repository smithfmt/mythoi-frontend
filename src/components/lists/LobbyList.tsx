"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import useUserId from "@hooks/useUserId";
import { useRouter } from "next/navigation";

const socket = io(process.env.NEXT_PUBLIC_EXPRESS_API_URL || "http://localhost:5000");

type Players = {
    id: number,
    email: string,
}[]

const LobbyList = () => {
  const [lobbies, setLobbies] = useState<{ id: number; name: string, players: Players }[]>([]);
  const [loading, setLoading] = useState(false);
  const [newLobbyName, setNewLobbyName] = useState("");
  const userId = useUserId();
  const router = useRouter();

  useEffect(() => {
    const fetchLobbies = async () => {
      try {
        const response = await axios.get(`/api/lobby`); // Call the Next.js API route
        setLobbies(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          alert("Error fetching lobbies: " + (error.response?.data?.message || "Something went wrong"));
        } else if (error instanceof Error) {
          alert("Error fetching lobbies: " + error.message);
        } else {
          alert("An unknown error occurred");
        }
      }
    };

    fetchLobbies();

    socket.on("lobbyListUpdate", (lobbyList) => {
      console.log("Lobby List Updated:", lobbyList);
      setLobbies(lobbyList);
    });

    return () => {
      socket.off("lobbyListUpdate");
    };
  }, []);

  const createLobby = async () => {
    if (!newLobbyName) {
      alert("Please enter a lobby name.");
      return;
    }

    if (!userId) {
        alert("User ID is required."); // Ensure user ID is available
        return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`/api/lobby`, { // Call the Next.js API route
        action: 'create', // Specify the action
        name: newLobbyName,
        userId, // Pass the user ID
      });
      setNewLobbyName("");
      router.push(`/lobby/${response.data.lobby.id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert("Error creating lobby: " + (error.response?.data?.message || "Something went wrong"));
      } else if (error instanceof Error) {
        alert("Error creating lobby: " + error.message);
      } else {
        alert("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const joinLobby = async (lobbyId: number) => {
    try {
      const response = await axios.post(`/api/lobby`, { // Call the Next.js API route
        action: 'join', // Specify the action
        lobbyId,
        userId, // Pass the user ID if needed
      });
      console.log("Joined lobby:", response.data);
      router.push(`/lobby/${lobbyId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert("Error joining lobby: " + (error.response?.data?.message || "Something went wrong"));
      } else if (error instanceof Error) {
        alert("Error joining lobby: " + error.message);
      } else {
        alert("An unknown error occurred");
      }
    }
  };

  return (
    <div className="relative z-50 bg-black text-neutral-50 p-16">
      <h1>Lobby List</h1>
      <ul>
        {lobbies.length > 0 ? (
          lobbies.map((lobby) => { 
            const isInLobby = !!lobby.players?.filter(player => player.id === userId).length;
            return (
            <li key={lobby.id} className="mb-2 flex justify-between items-center">
              {lobby.name}
              <button
                onClick={() => {
                    if (isInLobby) return router.push(`/lobby/${lobby.id}`)
                    joinLobby(lobby.id)
                }}
                className="bg-blue-500 text-white p-2 ml-4"
              >
                {isInLobby?"View Lobby":"Join Lobby"}
              </button>
            </li>
          )})
        ) : (
          <li>No lobbies available</li>
        )}
      </ul>

      <div className="mt-8">
        <input
          type="text"
          placeholder="New Lobby Name"
          value={newLobbyName}
          onChange={(e) => setNewLobbyName(e.target.value)}
          className="border p-2 mr-4"
        />
        <button
          onClick={createLobby}
          className="bg-green-500 text-white p-2"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Lobby"}
        </button>
      </div>
    </div>
  );
};

export default LobbyList;
