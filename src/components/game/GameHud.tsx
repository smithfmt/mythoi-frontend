const GameHud = ({ endTurn, drawBasicCard, boardValidation, scale, setScale, handleToggleShop, shopOpen }) => {
    const { success, error, invalidCards }:{success:boolean, error?:string, invalidCards?:{ card:string, error?:string }[]} = boardValidation;
    return (
        <div className="fixed w-full h-full z-[100] pointer-events-none">
            <div className="absolute right-0 bottom-0 flex flex-col my-16 mx-8 gap-4">
                <div className={`z-50 mb-48 min-w-16 min-h-16 flex flex-col bg-neutral-600 border-2 ${success?"border-green-500": "border-red-500"} rounded-lg text-neutral-50 p-4`}>
                    {error&&<p>{error}</p>}
                    {invalidCards&&invalidCards.map(item => (item.error?<p key={`${item.card}-error`}>{item.error}</p>:<></>))}
                </div>
                <div className="flex flex-col gap-2 top-[40%] right-2 z-[100] pointer-events-auto">
                    <button onClick={() => setScale(scale<3?scale+0.2:scale)} className="hover:cursor-pointer hover:bg-neutral-700 transition-all bg-neutral-800 p-2 border border-neutral-50 rounded-md text-neutral-50">Zoom in +</button>
                    <button onClick={() => setScale(scale>0.6?scale-0.2:scale)} className="hover:cursor-pointer hover:bg-neutral-700 transition-all bg-neutral-800 p-2 border border-neutral-50 rounded-md text-neutral-50">Zoom out -</button>
                </div>
                <button onClick={handleToggleShop} className="pointer-events-auto group p-16 w-16 h-16 rounded-full flex gap-2 justify-center items-center bg-neutral-800 text-neutral-50 font-black border border-neutral-50 text-nowrap hover:bg-neutral-700 transition-all">
                    {`${shopOpen?"Close":"Open"} Shop`}
                    <p className="group-hover:ml-1 transition-all">{">"}</p>
                </button>
                <button onClick={endTurn} className="pointer-events-auto group p-16 w-16 h-16 rounded-full flex gap-2 justify-center items-center bg-neutral-800 text-neutral-50 font-black border border-neutral-50 text-nowrap hover:bg-neutral-700 transition-all">
                    {"End Turn"}
                    <p className="group-hover:ml-1 transition-all">{">"}</p>
                </button>
                <button onClick={drawBasicCard} className="pointer-events-auto group p-16 w-16 h-16 rounded-full flex gap-2 justify-center items-center bg-blue-800 text-neutral-50 font-black border border-neutral-50 text-nowrap hover:bg-blue-700 transition-all">
                    {"Draw Card"}
                    <p className="group-hover:ml-1 transition-all">{">"}</p>
                </button>
            </div>
            
        </div>
    )
};

export default GameHud;