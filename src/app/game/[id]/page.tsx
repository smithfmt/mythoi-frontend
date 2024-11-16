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
import { useLoading } from "@components/providers/LoadingContext";
import ShopModal from "@components/game/ShopModal";

const GamePage = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const { startLoading, stopLoading } = useLoading();
    const { addError } = useErrorHandler();
    const userId = useUserId();
    const [gameData, setGameData] = useSocket<GameData>(`gameDataUpdate-${id}`);
    const [userData, setUserData] = useSocket<UserDataType>(`userDataUpdate-${userId}`);
    const [selected, setSelected] = useState<{selectedCard:PopulatedCardData|null}>({selectedCard:null});
    const [scale, setScale] = useState(1);
    const [shopOpen, setShopOpen] = useState(false);
    const playerData = useMemo(() => {
        return userData?.gameData ? JSON.parse(userData.gameData) as PlayerData : null;
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
                startLoading();
                const gameResponse = await fetchGameById(id);
                const userResponse = userId && await fetchUserById(userId);
                
                if (userResponse) setUserData(userResponse.data.userData);
                if (gameResponse) setGameData(gameResponse.data.game);
            } catch (error: unknown) {
                addError(handleError(error));
            } finally {
                stopLoading();
            }
        };

        fetchGame();
    }, [id, setGameData, setUserData, userId, addError, startLoading,stopLoading]);

    const handleSelection = async (generalCard:PopulatedCardData) => {
        try {
            startLoading();
            const response = await updateGameById(id, "selectGeneral", { generalCard });
            console.log("GENERAL SELECTED",response);
        } catch (error: unknown) {
            addError(handleError(error));
        } finally {
            stopLoading();
        }
    };

    const handlePlaceSelected = async (x:number, y:number, hand:boolean) => {
        if (!playerData || !userData) return addError({message: "No Player Data"});
        if (!spaces.filter(space => (space.x===x&&space.y===y)).length || !selected.selectedCard) return addError({message: "Space is not available"});
        const { uid } = selected.selectedCard;
        if (!uid) return addError({message: "No Card Found!"});
        const [updatedPlayerData, error] = placeCard(playerData, uid, {x,y,hand})
        if (error || !updatedPlayerData) return addError({message: error||"Unknown Error placing card"});
        setUserData({...userData,gameData:JSON.stringify(updatedPlayerData)});
        setSelected({selectedCard:null});
    };

    const handleCardClick = (cardData: CardObjectData) => {
        if (!playerData || !userData) return addError({message: "No Player Data"});
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
            startLoading();
            const response = await updateGameById(id, "endTurn", { playerData });
            setSelected({selectedCard:null})
            console.log(response)
        } catch (error: unknown) {
            addError(handleError(error));
        } finally {
            stopLoading();
        }
        
    };

    const handleDrawBasicCard = async () => {
        if (!playerData) return;
        try {
            startLoading();
            const response = await updateGameById(id, "drawCard", { playerData });
            console.log(response)
        } catch (error: unknown) {
            addError(handleError(error));
        } finally {
            stopLoading();
        }
    }

    const handleToggleShop = () => {
        setShopOpen(!shopOpen);
    }

    console.log(gameData)

    return (
        <div className="max-h-screen max-w-screen overflow-hidden flex flex-col items-center justify-center p-8 relative z-40">
            {playerData&&<GameHud scale={scale} setScale={setScale} endTurn={handleEndTurn} drawBasicCard={handleDrawBasicCard} boardValidation={valid} handleToggleShop={handleToggleShop} shopOpen={shopOpen}/>}
            {gameData&&<ShopModal shopOpen={shopOpen} shopCards={gameData.heroShop&&JSON.parse(gameData.heroShop)} setShopOpen={setShopOpen} hand={cardsInHand} gameId={parseInt(id)}/>}
            {gameData&& (
                <div>
                    <GameBoard 
                    invalidCards={valid.invalidCards} 
                    board={cardsInBoard as BoardType} 
                    selected={{ selectedCard: selected.selectedCard, spaces }} 
                    handlePlaceSelected={handlePlaceSelected} 
                    handleCardClick={handleCardClick} 
                    scale={scale}
                    />
                    <Hand selectedCard={selected.selectedCard} setSelected={setSelected} hand={cardsInHand} handleCardClick={handleCardClick} />
                    {/* Card following Mouse */}
                    <CardCursorTracker selectedCard={selected.selectedCard}/>
                </div>
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
