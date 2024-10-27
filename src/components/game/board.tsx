import { PlayerData, PopulatedCardData } from "@data/types";
import Card from "./Card";
  
const GameBoard: React.FC<{ playerData: PlayerData, selected: {selectedCard:PopulatedCardData|null,spaces:{x:number,y:number}[]} }> = ({ playerData, selected }) => {

    const handlePlaceSelected = (x:number,y:number) => {
        if (!selected.spaces.filter(space => (space.x===x&&space.y===y)).length || !selected.selectedCard) return;
        console.log("Placing", selected.selectedCard, x,y)
    }

    return (
      <div className="flex justify-center items-center max-h-[100vh] max-w-[100vw]">
        <div className="grid grid-cols-[repeat(11,13rem)] grid-rows-[repeat(11,18rem)] gap-1 border border-gray-300 ">
          {playerData.board.map((item) => (
            <div key={`card-${item.card.id}`} style={{gridColumn:item.x+1,gridRow:item.y+1}}>
              <Card card={item.card}/>
            </div>
          ))}
          {selected.spaces.length&&selected.spaces.map(({x,y}) => <div onClick={() => handlePlaceSelected(x,y)} key={`blank-${x}-${y}`} style={{gridColumn:x+1,gridRow:y+1}} className="bg-blue-400 bg-opacity-50 w-full h-full" />)}
        </div>
      </div>
      
    );
};
  
export default GameBoard;