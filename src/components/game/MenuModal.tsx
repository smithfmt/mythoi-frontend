import cardComponents from "@assets/card/cardComponents";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@components/providers/LoadingContext";
import { deleteAllGames } from "@app/requests";
import { useErrorHandler } from "@components/providers/ErrorContext";
import handleError from "@utils/handleError";

type Props = {
    menuOpen: boolean;
    setMenuOpen: (open:boolean) => void;
}

const MenuModal = ({ menuOpen, setMenuOpen }:Props) => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { startLoading, stopLoading } = useLoading();
    const { addError } = useErrorHandler();
    const router = useRouter();
    const toggleSettings = () => {
        setSettingsOpen(prev => !prev);
    }

    const handleDeleteGames = async () => {
        try {
            startLoading();
            await deleteAllGames();
            addError(handleError({ message: "Successfully deleted all games", status: 200, redirect: "/lobbies" }))
        } catch (error: unknown) {
            addError(handleError(error));
        } finally {
            stopLoading();
            router.push("/lobbies");
        }
    }
    return (
        <div onClick={() => setMenuOpen(false)} className={`z-[101] fixed top-0 left-0 w-full h-full justify-center items-center transition-all bg-neutral-900 bg-opacity-80 ${menuOpen?"flex opacity-100 pointer-events-auto":"hidden pointer-events-none opacity-0"}`}>
            <div onClick={(e) => e.stopPropagation()} className="relative h-[80vh] w-[calc(80vh*13/18)] grid-stack-children">
                <Image className="left-0 top-0 z-30 h-full w-fit object-contain pointer-events-none" src={cardComponents.Border.src} width={cardComponents.Border.width} height={cardComponents.Border.height} alt="border" />
                {/* Menu */}
                <div className="w-full h-full p-12">
                    <div className="flex flex-col items-center w-full h-full bg-amber-100 py-8 font-cinzel font-bold">
                        <h1 className="text-3xl mb-4">Game Menu</h1>
                        <div className="grid divide-neutral-300 divide-y-2 text-xl [&>*]:p-4 [&>*:hover]:bg-neutral-300 [&>*]:transition-all [&>*]:cursor-pointer">
                            <button onClick={() => router.push("/")}>Home</button>
                            <button onClick={toggleSettings}>Settings</button>
                            <button onClick={() => router.push("/lobbies")}>Return To Lobbies</button>
                            <button onClick={handleDeleteGames}>Delete all Games</button>
                        </div>

                    </div>
                </div>
                {/* Settings Menu */}
                {settingsOpen&&<div className="hidden">
                    
                </div>}                
            </div>
        </div>
    )
};

export default MenuModal;