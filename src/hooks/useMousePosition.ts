import { useEffect, useState } from "react";

const useMousePosition = (condition:boolean) => {

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (condition) setMousePos({
                x: event.clientX,
                y: event.clientY
            });
        };

        if (condition) window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [condition]);

    if (!condition) return null;
    return mousePos;
}

export default useMousePosition;