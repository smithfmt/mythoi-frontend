"use client";

import { useEffect, useMemo, useState } from "react";
import useUserId from "@hooks/useUserId";
import useSocket from "@hooks/useSocket";
import { BattleData, GameData, PlayerData, PopulatedCardData, sides, UserData } from "@data/types";
import GameBoard from "@components/game/board";
import Hand from "@components/game/Hand";
import { addActiveConnections, getPlaceableSpaces } from "@lib/game/gameLogic";
import Card from "@components/game/card";
import GameHud from "@components/game/GameHud";
import { placeCard } from "@lib/game/gameplay";
import { fetchBattleById, fetchCardsByCondition, fetchGameById, fetchPlayerById, fetchUserById, updateGameById } from "@app/requests";
import useBoardValidation from "@hooks/useBoardValidation";
import CardCursorTracker from "@components/game/CardCursorTracker";
import { useErrorHandler } from "@components/providers/ErrorContext";
import handleError from "@utils/handleError";
import { useLoading } from "@components/providers/LoadingContext";
import ShopModal from "@components/game/ShopModal";
import MenuModal from "@components/game/MenuModal";
import Battle from "@components/game/Battle";
import EndGameModal from "@components/game/EndGameModal";

const GamePage = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const { startLoading, stopLoading } = useLoading();
    const { addError } = useErrorHandler();
    const userId = useUserId();
    const [gameData, setGameData] = useSocket<GameData>(`gameDataUpdate-${id}`);
    const [battleData, setBattleData] = useSocket<BattleData>(`battleDataUpdate-${gameData?.currentBattleId}`);
    const [userData, setUserData] = useSocket<UserData>(`userDataUpdate-${userId}`);
    const [playerData, setPlayerData] = useSocket<PlayerData>(`playerDataUpdate-${userData?.player?.id}`);
    const [generalCards, setGeneralCards] = useState<PopulatedCardData[]>([]);
    const [selected, setSelected] = useState<{selectedCard:PopulatedCardData|null}>({selectedCard:null});
    const [scale, setScale] = useState(1);
    const [shopOpen, setShopOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const valid = useBoardValidation(playerData?.cards);
    
    const { cardsInBoard, cardsInHand, spaces } = useMemo(() => {
        const activeCards = playerData?.cards?.filter(c => !c.inDiscardPile) || [];
        const cardsInBoard = addActiveConnections(activeCards.filter(c => !c.inHand));
        const cardsInHand = activeCards.filter(c => c.inHand);
        const spaces = selected.selectedCard ? getPlaceableSpaces(cardsInBoard, selected.selectedCard) : [];
        return { activeCards, cardsInBoard, cardsInHand, spaces };
    }, [playerData?.cards, selected.selectedCard]);

    // Add keybinds
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.code) {
                case "KeyS":
                    event.preventDefault();
                    setShopOpen((prev) => !prev);
                    break;
                case "Space":
                    event.preventDefault();
                    setMenuOpen((prev) => !prev);
                    break;
                default:
                    break;
            }
        };

        const handleScrollWheel = (event: WheelEvent) => {
            if (event.deltaY > 0) return setScale((prevScale) => Math.max(0.1, prevScale - 0.1));
            return setScale((prevScale) => prevScale + 0.1);
        }

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("wheel", handleScrollWheel);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("wheel", handleScrollWheel);
        };
    }, []);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                startLoading();
                const gameResponse = await fetchGameById(id);
                const userResponse = userId && await fetchUserById(userId);
                const playerResponse = userResponse && userResponse.data.userData.player?.id && await fetchPlayerById(userResponse.data.userData.player.id);
                const generalsResponse = playerResponse && !playerResponse.data.player.generalSelected && await fetchCardsByCondition({ isGeneralSelection:true, playerId:playerResponse.data.player.id });
                if (userResponse) setUserData(userResponse.data.userData);
                if (gameResponse) setGameData(gameResponse.data.game);
                if (playerResponse) setPlayerData(playerResponse.data.player);
                if (generalsResponse) setGeneralCards(generalsResponse.data.cards);
                if (gameResponse.data.game.battling && gameResponse.data.game.currentBattleId) {
                    const battleResponse = await fetchBattleById(gameResponse.data.game.currentBattleId);
                    if (battleResponse) setBattleData(battleResponse.data.battle);
                }
            } catch (error: unknown) {
                addError(handleError(error));
            } finally {
                stopLoading();
            }
        };
        fetchGame();
    }, [id, setGameData, setUserData, userId, addError, startLoading, stopLoading, setPlayerData, setBattleData]);

    useEffect(() => {
        const loadBattleData = async () => {
            if (gameData?.battling && !battleData && gameData.currentBattleId) {
                const battleResponse = await fetchBattleById(gameData.currentBattleId);
                if (battleResponse) setBattleData(battleResponse.data.battle);
            }
        }
        loadBattleData();
    }, [gameData?.battling, battleData, gameData?.currentBattleId, setBattleData])

    const handleSelection = async (generalCard:PopulatedCardData) => {
        try {
            startLoading();
            await updateGameById(id, "selectGeneral", { generalCard });
        } catch (error: unknown) {
            addError(handleError(error));
        } finally {
            stopLoading();
        }
    };

    const handlePlaceSelected = async (x:number, y:number, inHand:boolean) => {
        if (!playerData || !userData) return addError({message: "No Player Data"});
        if (!spaces.filter(space => (space.x===x&&space.y===y)).length || !selected.selectedCard) return addError({message: "Space is not available"});
        const { uid } = selected.selectedCard;
        if (!uid) return addError({message: "No Card Found!"});
        const [updatedPlayerData, error] = placeCard(playerData, uid, {x,y,inHand})
        if (error || !updatedPlayerData) return addError({message: error||"Unknown Error placing card"});
        setPlayerData(updatedPlayerData);
        setSelected({selectedCard:null});
    };

    const handleCardClick = (card: PopulatedCardData) => {
        if (!playerData || !userData) return addError({message: "No Player Data"});
        const updatedPlayerData = { ...playerData };
        updatedPlayerData.cards = updatedPlayerData.cards.map(c => c.uid===card.uid ? { ...c, inHand: true, x: undefined, y: undefined } : c);
        setPlayerData(updatedPlayerData);
        const selectedCard = card;
        sides.forEach(side => selectedCard[side].active = false);
        setSelected({ selectedCard });
    };

    const handleEndTurn = async () => {
        if (!playerData) return;
        try {
            startLoading();
            await updateGameById(id, "endTurn", { cards: playerData.cards });
            setSelected({selectedCard:null});
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
            await updateGameById(id, "drawCard", { playerData });
        } catch (error: unknown) {
            addError(handleError(error));
        } finally {
            stopLoading();
        }
    }

    const handleToggleShop = () => {
        setShopOpen((prev) => !prev);
    }

    const isYourTurn = !!(playerData && gameData && !playerData.turnEnded && playerData.id === gameData.turnOrder[0]);

    const gameEnded = !!gameData?.winner;

    return (
        <div className="select-none max-h-screen max-w-screen overflow-hidden flex flex-col items-center justify-center p-8 relative z-40">
            <MenuModal menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
            {gameData?.battling && battleData ? 
                gameData.players ? (
                    <Battle 
                    battleData={battleData}
                    scale={scale} 
                    setScale={setScale} 
                    userId={userId} 
                    />
                ) : <div className="text-5xl font-black">Loading...</div> 
            :
            // Normal
                <>
                {gameData && gameEnded && <EndGameModal gameData={gameData} />}
                {playerData?.generalSelected&&<GameHud isYourTurn={isYourTurn} scale={scale} setScale={setScale} endTurn={handleEndTurn} drawBasicCard={handleDrawBasicCard} boardValidation={valid} handleToggleShop={handleToggleShop} shopOpen={shopOpen}/>}
                {gameData&&playerData&&<ShopModal isYourTurn={isYourTurn} playerData={playerData} shopOpen={shopOpen} shopCards={gameData.heroShop} setShopOpen={setShopOpen} hand={cardsInHand} gameId={parseInt(id)}/>}
                {gameData&& (
                    <div>
                        <GameBoard 
                        invalidCards={valid.invalidCards} 
                        board={cardsInBoard} 
                        selected={{ selectedCard: selected.selectedCard, spaces }} 
                        handlePlaceSelected={handlePlaceSelected} 
                        handleCardClick={handleCardClick} 
                        scale={scale}
                        />
                        <Hand selectedCard={selected.selectedCard} setSelected={setSelected} hand={cardsInHand} handleCardClick={handleCardClick} />
                        <CardCursorTracker selectedCard={selected.selectedCard}/>
                    </div>
                )}
                {playerData&&!playerData?.generalSelected&&<div className="fixed z-50 h-full w-full top-0 left-0 bg-neutral-800 bg-opacity-70 flex justify-center items-center">
                    <div className=" p-32 flex flex-col gap-32">
                        <h1 className="text-3xl font-black text-neutral-50">Select General</h1>
                        <div className="flex gap-16">
                            {generalCards.map((generalCard,i) => <div 
                                key={"gen"+i}
                                className="hover:cursor-pointer transition-all"
                                onClick={() => handleSelection(generalCard)}
                                >
                                <Card card={generalCard}/>
                                </div>)}
                        </div>
                    </div>
                </div>}
                </>
            }

            
        </div>
    );
};

export default GamePage;
