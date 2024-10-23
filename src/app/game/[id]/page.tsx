"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthToken } from "@utils/getAuthToken"; // Assuming you have a utility to get the token
import socket from "@utils/socketClient"
import useUserId from "@hooks/useUserId";


const GamePage = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const [game, setGame] = useState<{ name: string; players: { id: number; name: string }[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userId = useUserId();

    useEffect(() => {
        const fetchGame = async () => {
            try {
                // Fetch the game data from the API
                const response = await axios.get(`/api/game/${id}`, {
                    headers: { Authorization: `Bearer ${getAuthToken()}` }, // If needed for the game data request
                });
                setGame(response.data);
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data?.message || "An error occurred while fetching the game");
                } else if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchGame();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8 relative z-50">
            {game ? (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold mb-4">{game.name}</h1>
                    <h1>Hello {game.players.filter(p => p.id===userId)[0].name}</h1>
                    <h2 className="text-lg font-semibold mb-2">Players:</h2>
                    <ul>
                        {game.players.map(player => (
                            <li key={player.id} className="text-gray-700">
                                {player.name}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-gray-500">No game found.</p>
            )}
        </div>
    );
};

export default GamePage;
