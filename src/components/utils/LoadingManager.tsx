"use client"
import { useLoading } from "@components/providers/LoadingContext";
import { useEffect, useTransition } from "react";

function LoadingManager() {
    const [isPending] = useTransition();
    const { startLoading, stopLoading } = useLoading();

    useEffect(() => {
        if (isPending) {
            startLoading();
        } else {
            stopLoading();
        }
    }, [isPending, startLoading, stopLoading]);

    return null;
}

export default LoadingManager;