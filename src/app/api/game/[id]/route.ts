import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { handleAxiosError } from '@utils/handleAxiosError';

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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { action, ...data } = await req.json();
    const { id } = params;
    try {
      const response = await axios.put(`${EXPRESS_API_URL}/api/games/game/${id}`, {action, ...data}, {
        headers: getAuthHeaders(req),
      });
  
      return NextResponse.json(response.data, { status: 200 });
    } catch (error: unknown) {
      return handleAxiosError(error);
    }
  }


