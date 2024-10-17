"use client"

import { useEffect, useState } from "react";
import axios from "axios";

const LobbyPage = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const [lobby, setLobby] = useState<{ name: string; players: { id: number; name: string }[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLobby = async () => {
            try {
                console.log(id)
                const response = await axios.get(`/api/lobby/${id}`);
                setLobby(response.data);
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
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="relative z-50 text-red-500">{error}</p>;

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                {lobby ? (
                    <div className="relative bg-white rounded-lg shadow-lg p-6 z-50">
                        <h2 className="text-2xl font-bold mb-4">{lobby.name}</h2>
                        <h3 className="text-lg font-semibold">Players:</h3>
                        <ul>
                            {lobby.players.map(player => (
                                <li key={player.id} className="text-gray-700">{player.name}</li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="z-50 text-white font-black">No lobby found.</p>
                )}
            </main>
        </div>
    );
};

export default LobbyPage;
