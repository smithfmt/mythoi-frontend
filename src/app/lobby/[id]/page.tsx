"use client";

import { useEffect, useState } from "react";
import useUserId from "@hooks/useUserId";
import Link from "next/link";
import socket from "@utils/socketClient";
import { useLoading } from "@components/providers/LoadingContext";
import { useErrorHandler } from "@components/providers/ErrorContext";
import handleError from "@utils/handleError";
import { fetchLobbyById, updateLobbyById } from "@app/requests";
import { LobbyData } from "@data/types";

const LobbyPage = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const [lobby, setLobby] = useState<LobbyData | null>(null);
    const { startLoading, stopLoading } = useLoading();
    const { addError } = useErrorHandler();
    const [isHost, setIsHost] = useState(false);
    const userId = useUserId();

    useEffect(() => {
        const fetchLobby = async () => {
            try {
                startLoading();
                const response = await fetchLobbyById(id);
                setLobby(response.data.lobby);
                if (response.data.lobby.hostId === userId) {
                    setIsHost(true);
                }
            } catch (error) {
                addError(handleError(error));
            } finally {
                stopLoading();
            }
        };

        fetchLobby();
        
        socket.on(`lobbyDataUpdate-${id}`, (lobbyData) => {
            setLobby(lobbyData);
        });
      
          return () => {
            socket.off(`lobbyDataUpdate-${id}`);
          };
    }, [id, userId, startLoading, stopLoading, addError]);

    const startLobby = async () => {
        try {
            startLoading()
            await updateLobbyById(id, "start")
        } catch (error) {
            addError(handleError(error));
        } finally {
            stopLoading();
        }
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                {lobby?.game ? (
                        <button className="relative z-50 bg-blue-500 text-neutral-50 hover:bg-blue-700 active:bg-blue-400 active:text-neutral-20 transition-all outline-2 outline-blue-950 rounded-lg">
                            <Link className="w-full h-full p-12" href={`/game/${lobby.game.id}`}>{"Proceed to Game ->"}</Link>
                        </button>
                ) : lobby && (
                    <div className="relative bg-white rounded-lg shadow-lg p-6 z-50">
                        <h2 className="text-2xl font-bold mb-4">{lobby.name}</h2>
                        <h3 className="text-lg font-semibold">Players:</h3>
                        <ul>
                            {lobby.players.map(player => (
                                <li key={player.id} className="text-gray-700">{player.name}</li>
                            ))}
                        </ul>

                        {/* Only show the "Start Game" button if the current user is the host */}
                        {isHost && (
                            <button
                                onClick={startLobby}
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Start Game
                            </button>
                        )}
                    </div>
                ) }
            </main>
        </div>
    );
};

export default LobbyPage;

