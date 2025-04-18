import { useState, useEffect, useRef } from 'react';
import { PopulatedCardData } from "@data/types";
import Card from "./card";

type Props = {
  board: PopulatedCardData[]; 
  selected: {
    selectedCard: PopulatedCardData | null;
    spaces: { x: number; y: number }[];
  };
  handlePlaceSelected: (x: number, y: number, hand: boolean) => void;
  handleCardClick: (card: PopulatedCardData) => void;
  invalidCards: {
    card: string;
    error?: string;
  }[] | undefined;
  scale: number;
};

const GameBoard = ({ board, selected, handlePlaceSelected, handleCardClick, invalidCards, scale }: Props) => {
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement | null>(null);

  const easingDuration = 0.2; 

  useEffect(() => {
    if (dragging) {
      const handleMouseMove = (e: MouseEvent) => {
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        setOffset((prevOffset) => ({
          x: prevOffset.x + dx,
          y: prevOffset.y + dy,
        }));
        setStartPos({ x: e.clientX, y: e.clientY });
      };

      const handleMouseUp = () => {
        setDragging(false);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging, startPos]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const moveAmount = 50; 
      switch (e.key) {
        case "ArrowUp":
          setOffset((prev) => ({ ...prev, y: prev.y + moveAmount }));
          break;
        case "ArrowDown":
          setOffset((prev) => ({ ...prev, y: prev.y - moveAmount }));
          break;
        case "ArrowLeft":
          setOffset((prev) => ({ ...prev, x: prev.x + moveAmount }));
          break;
        case "ArrowRight":
          setOffset((prev) => ({ ...prev, x: prev.x - moveAmount }));
          break;
        default:
          break;
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      className="flex justify-center items-center max-h-[100vh] max-w-[100vw] hover:cursor-grab active:cursor-grabbing select-none"
      style={{ overflow: 'hidden' }}
    >
      <div
        ref={boardRef}
        className="relative"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transition: dragging ? 'none' : `transform ${easingDuration}s ease`, 
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="grid grid-cols-[repeat(11,13rem)] grid-rows-[repeat(11,18rem)] gap-1 border border-gray-300">
          {board.map((item, i) => (
            <div
              key={`card-${i}`}
              onMouseDown={(e) => (e.stopPropagation(),handleCardClick(item))}
              style={{ gridColumn: item.x||0 + 1, gridRow: item.y||0 + 1 }}
              className={`${
                invalidCards?.filter((c) => c.card === item.uid).length
                  ? "relative after:top-0 after:absolute after:z-50 after:w-full after:h-full after:bg-red-600 after:bg-opacity-50"
                  : ""
              }`}
            >
              <Card card={item} />
            </div>
          ))}
          {selected.spaces.length &&
            selected.spaces.map(({ x, y }) => (
              <div
                onClick={() => handlePlaceSelected(x, y, false)}
                onMouseUp={() => handlePlaceSelected(x, y, false)}
                key={`blank-${x}-${y}`}
                style={{ gridColumn: x, gridRow: y }}
                className="bg-blue-400 bg-opacity-50 w-full h-full"
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
