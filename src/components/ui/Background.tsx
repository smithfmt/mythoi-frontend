import Image from "next/image";
import { backgrounds } from "@assets/images";

const Background = ({ image }: { image:string }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full z-0">
            <Image className="w-full h-full object-cover" src={backgrounds[image]} alt={image} />
        </div>
    );
};

export default Background;