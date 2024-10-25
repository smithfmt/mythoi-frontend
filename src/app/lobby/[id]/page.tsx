"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthToken } from "@utils/getAuthToken"; // Assuming you have a way to get the current user ID
import useUserId from "@hooks/useUserId";
import Link from "next/link";
import socket from "@utils/socketClient";

const LobbyPage = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const [lobby, setLobby] = useState<{ name: string; players: { id: number; name: string }[]; host: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isHost, setIsHost] = useState(false); // Track if the current user is the host
    const [gameId, setGameId] = useState(null);
    const userId = useUserId();

    // Fetch the lobby details
    useEffect(() => {
        const fetchLobby = async () => {
            try {
                const response = await axios.get(`/api/lobby/${id}`, { headers: { Authorization: `Bearer ${getAuthToken()}` } });
                setLobby(response.data);

                // Check if the current user is the host
                if (response.data.host === userId) {
                    setIsHost(true);
                }
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

        fetchLobby();
        
        socket.on(`lobbyDataUpdate-${id}`, (lobbyData) => {
            if (lobbyData.gameId) setGameId(lobbyData.gameId);
            setLobby(lobbyData);
          });
      
          return () => {
            socket.off(`lobbyDataUpdate-${id}`);
          };
    }, [id, userId]);

    // Function to start the lobby
    const startLobby = async () => {
        try {
            // Call the start lobby API
            const response = await axios.post(
                "/api/lobby",
                { action: 'start', lobbyId: id }, // Pass the lobby ID
                { headers: { Authorization: `Bearer ${getAuthToken()}` } }
            );

            // TODO Redirect everyone to the game page
            setGameId(response.data.game)
            console.log("THIS GAME JUST STARTED",response.data.game)
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || "Failed to start the game");
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error && !gameId) return <p className="relative z-50 text-red-500">{error}</p>;

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                {gameId ? (
                        <button className="relative z-50 bg-blue-500 text-neutral-50 hover:bg-blue-700 active:bg-blue-400 active:text-neutral-20 transition-all outline-2 outline-blue-950 rounded-lg">
                            <Link className="w-full h-full p-12" href={`/game/${gameId}`}>{"Proceed to Game ->"}</Link>
                            </button>
                ) : lobby ? (
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
                ) : (
                    <p className="z-50 text-white font-black">No lobby found.</p>
                )}
            </main>
        </div>
    );
};

export default LobbyPage;

