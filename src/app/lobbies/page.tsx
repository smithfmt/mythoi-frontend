import LobbyList from "@components/lists/LobbyList";

const Lobbies = () => {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <LobbyList />
            </main>
        </div>
    );
};

export default Lobbies;