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
    const response = await axios.get(`${EXPRESS_API_URL}/api/lobbies/${id}`, {
      headers: getAuthHeaders(req),
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await axios.delete(`${EXPRESS_API_URL}/api/lobbies/${id}`, {
      headers: getAuthHeaders(req),
    });
    return NextResponse.json({ message: 'Lobby deleted' }, { status: 200 });
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
}

