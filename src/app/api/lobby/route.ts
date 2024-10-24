import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { handleAxiosError } from '@utils/handleAxiosError';
// import { getAuthToken } from '@utils/getAuthToken';

const EXPRESS_API_URL = process.env.EXPRESS_API_URL;
if (!EXPRESS_API_URL) throw new Error('No Express API URL');

const getAuthHeaders = (req: NextRequest) => {
  const token = req.headers.get('authorization') || '';
  return token ? { Authorization: `Bearer ${token.replace('Bearer ', '')}` } : {};
};

export async function POST(req: NextRequest) {
  const { action, ...data } = await req.json();

  try {
    let response;

    switch (action) {
      case 'create':
        response = await axios.post(`${EXPRESS_API_URL}/api/lobbies/create`, data, {
          headers: getAuthHeaders(req),
        });
        break;
      case 'join':
        response = await axios.post(`${EXPRESS_API_URL}/api/lobbies/join`, data, {
          headers: getAuthHeaders(req),
        });
        break;
      case 'leave': // New leave lobby action
        response = await axios.post(`${EXPRESS_API_URL}/api/lobbies/leave`, data, {
          headers: getAuthHeaders(req),
        });
        break;
      case 'start':
        response = await axios.post(`${EXPRESS_API_URL}/api/lobbies/start`, data, {
          headers: getAuthHeaders(req),
        });
        break;
      case 'deleteAll':
        response = await axios.delete(`${EXPRESS_API_URL}/api/lobbies`, {
          headers: getAuthHeaders(req),
        });
        break;
      case 'deleteStarted':
        response = await axios.delete(`${EXPRESS_API_URL}/api/lobbies/deleteStarted`, {
          headers: getAuthHeaders(req),
        });
        break;
      default:
        return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const response = await axios.get(`${EXPRESS_API_URL}/api/lobbies/all`, {
      headers: getAuthHeaders(req),
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
}


