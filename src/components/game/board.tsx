import { PlayerData } from "@data/types";
import Card from "./Card";
  
const GameBoard: React.FC<{ playerData: PlayerData }> = ({ playerData }) => {
    return (
      <div className="flex justify-center items-center max-h-[100vh] max-w-[100vw]">
        <div className="grid grid-cols-[repeat(11,13rem)] grid-rows-[repeat(11,18rem)] gap-1 border border-gray-300 ">
          {playerData.board.map((item) => (
            <div key={`card-${item.card.id}`} style={{gridColumn:item.x+1,gridRow:item.y+1}}>
              <Card card={item.card}/>
            </div>
          ))}
        </div>
      </div>
      
    );
};
  
export default GameBoard;