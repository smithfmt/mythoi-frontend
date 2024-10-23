import axios from "axios";
import { NextResponse } from "next/server";

export function handleAxiosError(error: unknown) {
    if (axios.isAxiosError(error)) {
        return NextResponse.json(
            { message: error.response?.data?.message || 'An error occurred' },
            { status: error.response?.status || 500 }
        );
    }
    if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
}