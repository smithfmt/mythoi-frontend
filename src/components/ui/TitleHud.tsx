const TitleHud = () => {

    return (
        <div className="fixed bottom-0 left-0 w-full">
            <div className="flex justify-center w-full gap-16 bg-neutral-800 bg-opacity-80 text-neutral-950 p-4">
                <button className="bg-neutral-200 py-8 px-16">Host Game</button>
                <button className="bg-neutral-200 py-8 px-16">Join Game</button>
                <button className="bg-neutral-200 py-8 px-16">Profile</button>
            </div>
        </div>
    );
};

export default TitleHud;