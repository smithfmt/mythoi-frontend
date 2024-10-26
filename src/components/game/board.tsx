import { PlayerData } from "@data/types";
import Card from "./card";
  
const GameBoard: React.FC<{ playerData: PlayerData }> = ({ playerData }) => {
    return (
      <div className="grid grid-cols-11 grid-rows-11 gap-1 w-[500px] h-[500px] border border-gray-300">
        {playerData.board.map((item) => (
          <Card key={`card-${item.card.id}`} card={item.card}/>
        ))}
      </div>
    );
};
  
export default GameBoard;