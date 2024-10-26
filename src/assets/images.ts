import Bridge from "@assets/backgrounds/Bridge.jpeg";
import { StaticImageData } from "next/image";

export const backgrounds:{[key: string]: StaticImageData} = {
    bridge: Bridge,
};

const importAll = (requireContext) => {
    const images = {};
    requireContext.keys().forEach((item) => {
      images[item.replace('./', '')] = requireContext(item);
    });
    return images;
  };
  

export const CardImages = importAll(require.context('/src/assets/card/images', false, /\.(png|jpe?g|svg)$/));