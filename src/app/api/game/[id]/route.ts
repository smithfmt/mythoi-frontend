import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const EXPRESS_API_URL = process.env.EXPRESS_API_URL;
if (!EXPRESS_API_URL) throw new Error('No Express API URL');

const getAuthHeaders = (req: NextRequest) => {
    const token = req.headers.get('authorization') || '';
    return token ? { Authorization: `Bearer ${token.replace('Bearer ', '')}` } : {};
};

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const response = await axios.get(`${EXPRESS_API_URL}/api/games/game/${id}`, {
            headers: getAuthHeaders(req),
        });
        return NextResponse.json(response.data, { status: 200 });
    } catch (error: unknown) {
        return handleAxiosError(error);
    }
}

function handleAxiosError(error: unknown) {
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
