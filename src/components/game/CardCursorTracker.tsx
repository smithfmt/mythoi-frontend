import { PopulatedCardData } from "@data/types";
import Card from "./Card";
import useMousePosition from "@hooks/useMousePosition";

const CardCursorTracker = ({selectedCard}:{selectedCard:PopulatedCardData|null}) => {
    const mousePosition = useMousePosition(true);
    if (!mousePosition || !selectedCard) return <></>
    return (
        <div
            className="fixed pointer-events-none transition-transform duration-200 ease-out z-50"
            style={{
                top: mousePosition.y,
                left: mousePosition.x,
                transform: "translate(-50%, -50%)"
            }}
        >
            <Card card={selectedCard} />
        </div>
    )
};

export default CardCursorTracker;