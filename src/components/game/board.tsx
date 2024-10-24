import { PlayerData } from "@data/types";
import { cards } from "@data/cards";
  
const GameBoard: React.FC<{ playerData: PlayerData }> = ({ playerData }) => {
    return (
      <div className="grid grid-cols-11 grid-rows-11 gap-1 w-[500px] h-[500px] border border-gray-300">
        {playerData.board.map((item) => (
          <div
            key={item.card.id}
            className="bg-blue-300 border border-black flex justify-center items-center text-black"
            style={{
              gridColumnStart: item.x + 1,
              gridRowStart: item.y + 1, 
            }}
          >
            {`${cards[item.card.type][item.card.id].name}`}
          </div>
        ))}
      </div>
    );
};
  
export default GameBoard;