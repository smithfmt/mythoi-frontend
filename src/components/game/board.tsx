import { BoardType, CardObjectData, PopulatedCardData } from "@data/types";
import Card from "./Card";

const GameBoard: React.FC<{ board: BoardType, selected: {selectedCard:PopulatedCardData|null,spaces:{x:number,y:number}[]}, handlePlaceSelected: (x:number, y:number, hand:boolean) => void ,handleCardClick: (card:CardObjectData) => void }> = ({ board, selected, handlePlaceSelected, handleCardClick }) => {

    return (
      <div className="flex justify-center items-center max-h-[100vh] max-w-[100vw]">
        <div className="grid grid-cols-[repeat(11,13rem)] grid-rows-[repeat(11,18rem)] gap-1 border border-gray-300 ">
          {board.map((item,i) => (
            <div key={`card-${i}`} onClick={() => handleCardClick(item)} style={{gridColumn:item.x+1,gridRow:item.y+1}}>
              <Card card={item.card}/>
            </div>
          ))}
          {selected.spaces.length&&selected.spaces.map(({x,y}) => <div onClick={() => handlePlaceSelected(x,y,false)} key={`blank-${x}-${y}`} style={{gridColumn:x+1,gridRow:y+1}} className="bg-blue-400 bg-opacity-50 w-full h-full" />)}
        </div>
      </div>
      
    );
};
  
export default GameBoard;