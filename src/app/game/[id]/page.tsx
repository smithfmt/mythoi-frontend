"use client";

import { useEffect, useMemo, useState } from "react";
import useUserId from "@hooks/useUserId";
import useSocket from "@hooks/useSocket";
import { BoardType, CardObjectData, GameData, PlayerData, PopulatedCardData, UserDataType } from "@data/types";
import GameBoard from "@components/game/Board";
import Hand from "@components/game/Hand";
import { addActiveConnections, getPlaceableSpaces } from "@lib/game/gameLogic";
import Card from "@components/game/Card";
import GameHud from "@components/game/GameHud";
import { placeCard } from "@lib/game/gameplay";
import { fetchGameById, fetchUserById, updateGameById } from "@app/requests";
import useBoardValidation from "@hooks/useBoardValidation";
import CardCursorTracker from "@components/game/CardCursorTracker";
import { useErrorHandler } from "@components/providers/ErrorContext";
import handleError from "@utils/handleError";

const GamePage = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const [loading, setLoading] = useState(true);   
    const { addError } = useErrorHandler();
    const userId = useUserId();
    const [gameData, setGameData] = useSocket<GameData>(`gameDataUpdate-${id}`);
    const [userData, setUserData] = useSocket<UserDataType>(`userDataUpdate-${userId}`);
    const [selected,setSelected] = useState<{selectedCard:PopulatedCardData|null}>({selectedCard:null});
    const playerData = useMemo(() => {
        return userData ? JSON.parse(userData.gameData) as PlayerData : null;
    }, [userData]);
    const valid = useBoardValidation(playerData);
    const { cardsInBoard, cardsInHand } = useMemo(() => {
        const cardsWithConnections = playerData?.cards ? addActiveConnections(playerData.cards as BoardType) : [];
        const inBoard: CardObjectData[] = [];
        const inHand: CardObjectData[] = [];
        cardsWithConnections.forEach(cardData => cardData.hand ? inHand.push(cardData) : inBoard.push(cardData));
        return { cardsInBoard:inBoard, cardsInHand: inHand };
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
                addError(handleError(error));
            } finally {
                setLoading(false);
            }
        };

        fetchGame();
    }, [id, setGameData, setUserData, userId, addError]);

    const handleSelection = async (generalCard:PopulatedCardData) => {
        try {
            const response = await updateGameById(id, "selectGeneral", { generalCard });
            console.log("GENERAL SELECTED",response);
        } catch (error: unknown) {
            addError(handleError(error));
        }
    };

    const handlePlaceSelected = async (x:number, y:number, hand:boolean) => {
        if (!playerData || !userData) return console.warn("No Player Data");
        if (!spaces.filter(space => (space.x===x&&space.y===y)).length || !selected.selectedCard) return console.warn("Space is not available");
        const { uid } = selected.selectedCard;
        if (!uid) return console.warn("No Card Found!");
        const [updatedPlayerData, error] = placeCard(playerData, uid, {x,y,hand})
        if (error || !updatedPlayerData) return console.warn(error);
        setUserData({...userData,gameData:JSON.stringify(updatedPlayerData)});
        setSelected({selectedCard:null});
    };

    const handleCardClick = (cardData: CardObjectData) => {
        if (!playerData || !userData) return console.warn("No Player Data");
        const updatedPlayerData = { ...playerData };
        updatedPlayerData.cards = updatedPlayerData.cards.map(data => data.card.uid===cardData.card.uid ? { card: data.card, hand: true } : data);
        setUserData({...userData, gameData: JSON.stringify(updatedPlayerData)});
        const selectedCard = cardData.card;
        Object.keys(cardData.card.sides).forEach(side => selectedCard.sides[side].active = false);
        setSelected({ selectedCard });
    };

    const handleEndTurn = async () => {
        if (!playerData) return;
        try {
            const response = await updateGameById(id, "endTurn", { playerData });
            setSelected({selectedCard:null})
            console.log(response)
        } catch (error: unknown) {
            addError(handleError(error));
        }
        
    };

    const handleDrawBasicCard = async () => {
        if (!playerData) return;
        try {
            const response = await updateGameById(id, "drawCard", { playerData });
            console.log(response)
        } catch (error: unknown) {
            addError(handleError(error));
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 relative z-40">
            {playerData&&<GameHud endTurn={handleEndTurn} drawBasicCard={handleDrawBasicCard} boardValidation={valid} />}
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
            {playerData&&!playerData?.generals?.selected&&<div className="fixed z-50 h-full w-full top-0 left-0 bg-neutral-800 bg-opacity-70 flex justify-center items-center">
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
