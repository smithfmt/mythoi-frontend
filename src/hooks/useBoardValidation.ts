import { BoardType, PlayerData } from "@data/types";
import { checkValidBoard } from "@lib/game/gameLogic";
import { useEffect, useState } from "react";

const useBoardValidation = (playerData: PlayerData | null) => {
    const [valid, setValid] = useState<{success:boolean, error?:string, invalidCards?:{ card:string, error?:string }[]}>({success: false, error: "No Player Data",});
   
    useEffect(() => {
        if (playerData) {
            const board = playerData?.cards.filter(cardData => !cardData.hand&&cardData.x&&cardData.y) as BoardType;
            const validation = checkValidBoard(board)
            setValid(validation);
        };
        
    },[playerData]);

    return valid;
}

export default useBoardValidation;