import { PopulatedCardData } from "@data/types";
import { checkValidBoard } from "@lib/game/gameLogic";
import { useEffect, useState } from "react";

const useBoardValidation = (cards: PopulatedCardData[] | undefined) => {
    const [valid, setValid] = useState<{success:boolean, error?:string, invalidCards?:{ card:string, error?:string }[]}>({success: false, error: "No Player Data",});
   
    useEffect(() => {
        if (cards) {
            const board = cards.filter(card => !card.inHand&&card.x&&card.y);
            const validation = checkValidBoard(board);
            setValid(validation);
        };
        
    },[cards]);

    return valid;
}

export default useBoardValidation;