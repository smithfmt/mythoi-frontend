"use client";

import { useEffect, useState } from "react";
import useUserId from "@hooks/useUserId";
import { useRouter } from "next/navigation";
import socket from "@utils/socketClient"
import { useErrorHandler } from "@components/providers/ErrorContext";
import handleError from "@utils/handleError";
import { useLoading } from "@components/providers/LoadingContext";
import { fetchAllGames } from "@app/requests";

type Players = {
    id: number,
    email: string,
}[];

const GameList = () => {
  const [games, setGames] = useState<{ id: number; name: string, players: Players, host: string }[]>([]);
  const userId = useUserId();
  const router = useRouter();
  const { addError } = useErrorHandler();
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        startLoading();
        const response = await fetchAllGames();
        setGames(response.data.games);
      } catch (error: unknown) {
        addError(handleError(error));
      } finally {
        stopLoading();
      }
    };
    fetchGames();

    socket.on("gameListUpdate", (gameList) => {
      setGames(gameList);
    });

    return () => {
      socket.off("gameListUpdate");
    };
  }, [addError, startLoading, stopLoading]);
  
  return (
    <div className="relative z-50 bg-black text-neutral-50 p-16">
      <h1>Game List</h1>
      <ul>
        {games.length > 0 ? (
          games.map((game) => {
            const isInGame = !!game.players?.find(player => player.id === userId);
            return (
              <li key={game.id} className="mb-2 flex justify-between items-center">
                {game.name}
                <div className="flex">
                  <button
                    onClick={() => {
                      if (isInGame) return router.push(`/game/${game.id}`);
                    }}
                    className="bg-blue-500 text-white p-2 ml-4"
                  >
                    {"Return to Game >"}
                  </button>
                </div>
              </li>
            );
          })
        ) : (
          <li>No games available</li>
        )}
      </ul>
    </div>
  );
};

export default GameList;
