import { NextResponse } from "next/server";

export const handleResponse = ({message, status, data}: { message: string, status: number, data?: unknown }) => {
    if (status < 300) return NextResponse.json(data, { status });
    return NextResponse.json({ message }, { status });
}