"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import useUserId from "@hooks/useUserId";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@app/lib/auth/getAuthToken";
import socket from "@utils/socketClient"

type Players = {
    id: number,
    email: string,
}[];

const LobbyList = () => {
  const [lobbies, setLobbies] = useState<{ id: number; name: string, players: Players, host: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [newLobbyName, setNewLobbyName] = useState("");
  const userId = useUserId();
  const router = useRouter();

  useEffect(() => {
    const fetchLobbies = async () => {
      try {
        const response = await axios.get(`/api/lobby`, { headers: {Authorization: `Bearer ${getAuthToken()}`} });
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
      console.log(getAuthToken())
      const response = await axios.post(`/api/lobby`, {
        action: 'create',
        name: newLobbyName,
        userId,
      },{ headers: {Authorization: `Bearer ${getAuthToken()}`} });
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
      const response = await axios.post(`/api/lobby`, {
        action: 'join',
        lobbyId,
        userId,
      },{ headers: {Authorization: `Bearer ${getAuthToken()}`} });
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

  const leaveLobby = async () => {
    try {
      await axios.post(`/api/lobby`, {
        action: 'leave',
      },{ headers: {Authorization: `Bearer ${getAuthToken()}`} });
      console.log("Left lobby");
      // Handle lobby update after leaving (fetch updated lobbies, for example)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert("Error leaving lobby: " + (error.response?.data?.message || "Something went wrong"));
      } else if (error instanceof Error) {
        alert("Error leaving lobby: " + error.message);
      } else {
        alert("An unknown error occurred");
      }
    }
  };

  const deleteLobby = async (lobbyId: number) => {
    try {
      await axios.delete(`/api/lobby/${lobbyId}`,{ headers: {Authorization: `Bearer ${getAuthToken()}`} });
      console.log("Deleted lobby");
      // Handle lobby update after deleting (fetch updated lobbies, for example)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert("Error deleting lobby: " + (error.response?.data?.message || "Something went wrong"));
      } else if (error instanceof Error) {
        alert("Error deleting lobby: " + error.message);
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
            const isInLobby = !!lobby.players?.find(player => player.id === userId);
            const isHost = parseInt(lobby.host) === userId;
            return (
              <li key={lobby.id} className="mb-2 flex justify-between items-center">
                {lobby.name}
                <div className="flex">
                  <button
                    onClick={() => {
                      if (isInLobby) return router.push(`/lobby/${lobby.id}`);
                      joinLobby(lobby.id);
                    }}
                    className="bg-blue-500 text-white p-2 ml-4"
                  >
                    {isInLobby ? "View Lobby" : "Join Lobby"}
                  </button>
                  {isInLobby && !isHost && (
                    <button
                      onClick={() => leaveLobby()}
                      className="bg-yellow-500 text-white p-2 ml-2"
                    >
                      Leave Lobby
                    </button>
                  )}
                  {isHost && (
                    <button
                      onClick={() => deleteLobby(lobby.id)}
                      className="bg-red-500 text-white p-2 ml-2"
                    >
                      Delete Lobby
                    </button>
                  )}
                </div>
              </li>
            );
          })
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
