"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthToken } from "@utils/getAuthToken"; 
import useUserId from "@hooks/useUserId";
import useSocket from "@hooks/useSocket";
import { BoardType, CardObjectData, GameData, PlayerData, PopulatedCardData } from "@data/types";
import GameBoard from "@components/game/Board";
import Hand from "@components/game/Hand";
import { getPlaceableSpaces } from "@utils/gameLogic";

// TODO : INSTEAD OF RESTRICTING WHERE CARDS CAN BE PLACED, JUST HIGHLIGHT WHEN THEY ARE INCORRECTLY PLACED


const GamePage = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const [loading, setLoading] = useState(true);   
    const [error, setError] = useState<string | null>(null);
    const userId = useUserId();
    const [gameData, setGameData] = useSocket<GameData>(`gameDataUpdate-${id}`);
    const playerData:PlayerData[] | null = gameData?.playerData ? JSON.parse(gameData.playerData) : null;
    const currentPlayerData = playerData?.filter(p => p.player===userId)[0];

    const [selected,setSelected] = useState<{selectedCard:PopulatedCardData|null,spaces:{x:number,y:number}[]}>({selectedCard:null,spaces:[]});
    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response:{data:GameData} = await axios.get(`/api/game/${id}`, {
                    headers: { Authorization: `Bearer ${getAuthToken()}` },
                });
                setGameData(response.data);
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
    }, [id, setGameData]);

    const handleSelection = async (genId:number) => {
        try {
            const response = await axios.put(`/api/game/${id}`, {
                action: "selectGeneral",
                data: {
                    generalId: genId, 
                }
            }, {
                headers: { Authorization: `Bearer ${getAuthToken()}` },  
            });
            console.log("GENERAL SELECTED",response);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || "An error occurred while fetching the game");
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    const handlePlaceSelected = async (x:number, y:number, hand:boolean) => {
        if (!selected.spaces.filter(space => (space.x===x&&space.y===y)).length || !selected.selectedCard) return console.warn("Space is not available");
        const { uid } = selected.selectedCard;
        if (!uid) return console.warn("No Card Found!");
        console.log("Trying to place:", uid, x, y, hand);
        const response = await axios.put(`/api/game/${id}`, {
            action: "placeCard",
            data: {
              uid,
              space: { x, y, hand },
            },
          }, {
              headers: { Authorization: `Bearer ${getAuthToken()}` },  
          });
        console.log(response);
        setSelected({selectedCard:null,spaces:[]});
    };
    console.log(selected)

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const handleCardClick = (cardData: CardObjectData) => {
        const { card } = cardData;
        if (!currentPlayerData) return console.warn("No player found!");
        const spaces = getPlaceableSpaces(cardsInBoard, card);
        setSelected({selectedCard:card,spaces});
    };
    const cardsInBoard:CardObjectData[] = [];
    const cardsInHand:CardObjectData[] = [];
    currentPlayerData?.cards?.forEach(c => c.hand?cardsInHand.push(c):cardsInBoard.push(c));
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 relative z-40">
            {gameData ? (
                // <div className="bg-white rounded-lg shadow-lg p-6">
                //     <h1 className="text-3xl font-bold mb-4">{gameData.name}</h1>
                //     <h1>Hello {gameData.players.filter(p => p.id===userId)[0].name}</h1>
                //     <h2 className="text-lg font-semibold mb-2">Players:</h2>
                //     <ul>
                //         {gameData.players.map(player => (
                //             <li key={player.id} className="text-gray-700">
                //                 {player.name}
                //             </li>
                //         ))}
                //     </ul>
                // </div>
                <div>
                    {currentPlayerData&&
                        <div>
                            <GameBoard board={cardsInBoard as BoardType} selected={selected} handlePlaceSelected={handlePlaceSelected} handleCardClick={handleCardClick} />
                            {<Hand hand={cardsInHand} handleCardClick={handleCardClick} />}
                        </div>}
                    
                </div>
            ) : (
                <p className="text-gray-500">No game found.</p>
            )}
            {!currentPlayerData?.generals.selected&&<div className="fixed z-50 h-full w-full top-0 left-0 bg-neutral-800 bg-opacity-70 flex justify-center items-center">
                <div className="bg-neutral-50 p-32 text-neutral-800 flex flex-col gap-32">
                    <h1 className="text-3xl font-black">Select General</h1>
                    <div className="flex gap-16 [&>div]:p-16 [&>div]:text-2xl">
                        {currentPlayerData?.generals.choices.map(genId => <div 
                            key={"gen"+genId}
                            className="p-16 text-2xl outline-2 rounded-lg outline-blue-700 hover:bg-neutral-300 hover:cursor-pointer transition-all active:bg-blue-300"
                            onClick={() => handleSelection(genId)}
                            >
                            {"Card: "+genId}
                            </div>)}
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default GamePage;
