"use client";

import { useEffect, useState } from "react";
import useUserId from "@hooks/useUserId";
import { useRouter } from "next/navigation";
import socket from "@utils/socketClient"
import handleError from "@utils/handleError";
import { useErrorHandler } from "@components/providers/ErrorContext";
import { useLoading } from "@components/providers/LoadingContext";
import { createNewLobby, deleteLobbyById, fetchAllLobbies, joinLobbyById, userLeaveLobby } from "@app/requests";

type Players = {
    id: number,
    email: string,
}[];

interface Lobby {
  id: number; 
  name: string; 
  players: Players; 
  host: string;
}

const LobbyList = () => {
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const { startLoading, stopLoading } = useLoading();
  const [newLobbyName, setNewLobbyName] = useState("");
  const userId = useUserId();
  const router = useRouter();
  const { addError } = useErrorHandler();

  useEffect(() => {
    const fetchLobbies = async () => {
      try {
        startLoading();
        const response = await fetchAllLobbies();
        setLobbies(response.data.lobbies);
      } catch (error: unknown) {
        addError(handleError(error));
      } finally {
        stopLoading();
      }
    };

    fetchLobbies();

    socket.on("lobbyListUpdate", ({ data }: { data: { lobbies: Lobby[] }}) => {
      const { lobbies } = data;
      setLobbies(lobbies);
    });

    return () => {
      socket.off("lobbyListUpdate");
    };
  }, [addError, startLoading, stopLoading]);

  const createLobby = async () => {
    if (!newLobbyName) return addError({message: "Please enter a lobby name."});

    try {
      startLoading();
      const response = await createNewLobby(newLobbyName);
      setNewLobbyName("");
      router.push(`/lobby/${response.data.lobby.id}`);
    } catch (error: unknown) {
      addError(handleError(error));
    } finally {
      stopLoading();
    }
  };

  const joinLobby = async (lobbyId: number) => {
    try {
      startLoading();
      await joinLobbyById(lobbyId);
      router.push(`/lobby/${lobbyId}`);
    } catch (error: unknown) {
      addError(handleError(error));
    } finally {
      stopLoading();
    }
  };

  const leaveLobby = async () => {
    try {
      startLoading();
      await userLeaveLobby();
    } catch (error: unknown) {
      addError(handleError(error));
    } finally {
      stopLoading();
    }
  };

  const deleteLobby = async (lobbyId: number) => {
    try {
      startLoading();
      await deleteLobbyById(lobbyId);
    } catch (error: unknown) {
      addError(handleError(error));
    } finally {
      stopLoading();
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
        >
          Create Lobby
        </button>
      </div>
    </div>
  );
};

export default LobbyList;
