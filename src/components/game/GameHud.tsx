const GameHud = ({ endTurn, drawBasicCard, boardValidation }) => {
    const { success, error, invalidCards }:{success:boolean, error?:string, invalidCards?:{ card:string, error?:string }[]} = boardValidation;
    
    return (
        <div className="fixed w-full h-full z-50 pointer-events-none">
            <div className={`z-50 absolute right-2 top-16 min-w-16 min-h-16 flex flex-col bg-neutral-600 border-2 ${success?"border-green-500": "border-red-500"} rounded-lg text-neutral-50 p-4`}>
                {error&&<p>{error}</p>}
                {invalidCards&&invalidCards.map(item => (item.error?<p key={`${item.card}-error`}>{item.error}</p>:<></>))}
            </div>
            <button onClick={endTurn} className="pointer-events-auto group absolute right-0 bottom-0 m-16 p-16 w-16 h-16 rounded-full flex gap-2 justify-center items-center bg-neutral-800 text-neutral-50 font-black border border-neutral-50 text-nowrap hover:bg-neutral-700 transition-all">
                {"End Turn"}
                <p className="group-hover:ml-1 transition-all">{">"}</p>
            </button>
            <button onClick={drawBasicCard} className="pointer-events-auto group absolute right-0 bottom-48 m-16 p-16 w-16 h-16 rounded-full flex gap-2 justify-center items-center bg-blue-800 text-neutral-50 font-black border border-neutral-50 text-nowrap hover:bg-blue-700 transition-all">
                {"Draw Card"}
                <p className="group-hover:ml-1 transition-all">{">"}</p>
            </button>
        </div>
    )
};

export default GameHud;