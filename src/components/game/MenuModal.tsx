import cardComponents from "@assets/card/cardComponents";
import Image from "next/image";

type Props = {
    menuOpen: boolean;
    setMenuOpen: (open:boolean) => void;
}

const MenuModal = ({ menuOpen, setMenuOpen }:Props) => {
    return (
        <div onClick={() => setMenuOpen(false)} className={`z-[100] fixed top-0 left-0 w-full h-full justify-center items-center transition-all ${menuOpen?"flex opacity-100 pointer-events-auto":"hidden pointer-events-none opacity-0"}`}>
            <div onClick={(e) => e.stopPropagation()} className="relative h-[80vh] w-[calc(80vh*13/18)] grid-stack-children">
                <Image className="left-0 top-0 z-30 h-full w-fit object-contain" src={cardComponents.Border.src} width={cardComponents.Border.width} height={cardComponents.Border.height} alt="border" />
                {/* Menu */}
                <div className="w-full h-full p-12">
                    <div className="flex flex-col  items-center w-full h-full bg-neutral-50 py-8">
                        <h1 className="">Game Menu</h1>
                        <button>Home</button>
                        <button>Settings</button>
                        <button>Return To Lobbies</button>
                        <button>Delete all Games</button>
                    </div>
                </div>
                
            </div>
        </div>
    )
};

export default MenuModal;