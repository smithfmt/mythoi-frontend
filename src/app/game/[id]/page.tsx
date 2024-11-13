"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import useUserId from "@hooks/useUserId";
import useSocket from "@hooks/useSocket";
import { BoardType, CardObjectData, GameData, PlayerData, PopulatedCardData, UserDataType } from "@data/types";
import GameBoard from "@components/game/Board";
import Hand from "@components/game/Hand";
import { getPlaceableSpaces } from "@lib/game/gameLogic";
import Card from "@components/game/Card";
import GameHud from "@components/game/GameHud";
import { placeCard } from "@lib/game/gameplay";
import { fetchGameById, fetchUserById, updateGameById } from "@app/requests";
import useBoardValidation from "@hooks/useBoardValidation";
import CardCursorTracker from "@components/game/CardCursorTracker";

// TODO : INSTEAD OF RESTRICTING WHERE CARDS CAN BE PLACED, JUST HIGHLIGHT WHEN THEY ARE INCORRECTLY PLACED
// ADD Validation to Frontend placement
// Reorg the way player data is stored so that each player has their own JSON string


const GamePage = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const [loading, setLoading] = useState(true);   
    const [error, setError] = useState<string | null>(null);
    const userId = useUserId();
    const [gameData, setGameData] = useSocket<GameData>(`gameDataUpdate-${id}`);
    const [userData, setUserData] = useSocket<UserDataType>(`userDataUpdate-${userId}`);
    const [selected,setSelected] = useState<{selectedCard:PopulatedCardData|null}>({selectedCard:null});
    const playerData = useMemo(() => {
        return userData ? JSON.parse(userData.gameData) as PlayerData : null;
    }, [userData]);
    const valid = useBoardValidation(playerData);
    const { cardsInBoard, cardsInHand } = useMemo(() => {
        const inBoard: CardObjectData[] = [];
        const inHand: CardObjectData[] = [];
        playerData?.cards.forEach(cardData => cardData.hand ? inHand.push(cardData) : inBoard.push(cardData));
        return { cardsInBoard: inBoard, cardsInHand: inHand };
    }, [playerData]);
    const spaces = useMemo(() => {
        return selected.selectedCard ? getPlaceableSpaces(cardsInBoard, selected.selectedCard) : [];
    }, [cardsInBoard, selected.selectedCard]);
    
    useEffect(() => {
        const fetchGame = async () => {
            try {
                const gameResponse = await fetchGameById(id);
                const userResponse = userId && await fetchUserById(userId);
                
                if (userResponse) setUserData(userResponse.data.userData);
                if (gameResponse) setGameData(gameResponse.data.game);
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
    }, [id, setGameData, setUserData, userId]);

    if (!gameData || !userData || !playerData) return <p>No Data found</p>;

    const handleSelection = async (generalCard:PopulatedCardData) => {
        try {
            const response = await updateGameById(id, "selectGeneral", { generalCard });
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
        if (!playerData) return console.warn("No Player Data");
        if (!spaces.filter(space => (space.x===x&&space.y===y)).length || !selected.selectedCard) return console.warn("Space is not available");
        const { uid } = selected.selectedCard;
        if (!uid) return console.warn("No Card Found!");
        const [updatedPlayerData, error] = placeCard(playerData, uid, {x,y,hand})
        if (error || !updatedPlayerData) return console.warn(error);
        setUserData({...userData,gameData:JSON.stringify(updatedPlayerData)});
        setSelected({selectedCard:null});
    };

    const handleCardClick = (cardData: CardObjectData) => {
        // Remove card from the board 
        // Update User data to change card data // 
        const updatedPlayerData = { ...playerData };
        updatedPlayerData.cards = updatedPlayerData.cards.map(data => data.card.uid===cardData.card.uid ? { card: data.card, hand: true } : data);
        setUserData({...userData, gameData: JSON.stringify(updatedPlayerData)});
        setSelected({ selectedCard:cardData.card });
    };

    const handleEndTurn = async () => {
        if (!playerData) return;
        const response = await updateGameById(id, "endTurn", { playerData });
        console.log(response)
    };

    const handleDrawBasicCard = async () => {
        if (!playerData) return;
        const response = await updateGameById(id, "drawCard", { playerData });
        console.log(response)
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 relative z-40">
            <GameHud endTurn={handleEndTurn} drawBasicCard={handleDrawBasicCard} boardValidation={valid} />
            {gameData ? (
                <div>
                    <GameBoard invalidCards={valid.invalidCards} board={cardsInBoard as BoardType} selected={{ selectedCard: selected.selectedCard, spaces }} handlePlaceSelected={handlePlaceSelected} handleCardClick={handleCardClick} />
                    <Hand selectedCard={selected.selectedCard} setSelected={setSelected} hand={cardsInHand} handleCardClick={handleCardClick} />
                    {/* Card following Mouse */}
                    <CardCursorTracker selectedCard={selected.selectedCard}/>
                </div>
            ) : (
                <p className="text-gray-500">No game found.</p>
            )}
            {!playerData?.generals?.selected&&<div className="fixed z-50 h-full w-full top-0 left-0 bg-neutral-800 bg-opacity-70 flex justify-center items-center">
                <div className=" p-32 flex flex-col gap-32">
                    <h1 className="text-3xl font-black text-neutral-50">Select General</h1>
                    <div className="flex gap-16">
                        {playerData.generals.choices.map((generalCard,i) => <div 
                            key={"gen"+i}
                            className="hover:cursor-pointer transition-all"
                            onClick={() => handleSelection(generalCard)}
                            >
                            <Card card={generalCard}/>
                            </div>)}
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default GamePage;
