const GameHud = ({ endTurn }) => {

    return (
        <div className="fixed w-full h-full z-50 pointer-events-none">
            <button onClick={endTurn} className="pointer-events-auto group absolute right-0 bottom-0 m-16 p-16 w-16 h-16 rounded-full flex gap-2 justify-center items-center bg-neutral-800 text-neutral-50 font-black border border-neutral-50 text-nowrap hover:bg-neutral-700 transition-all">
                {"End Turn"}
                <p className="group-hover:ml-1 transition-all">{">"}</p>
            </button>
        </div>
    )
};

export default GameHud;