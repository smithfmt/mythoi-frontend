import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
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

export async function DELETE(req: NextRequest) {
  const { action } = await req.json();

  try {
    let response;

    switch (action) {
      case 'deleteAll':
        response = await axios.delete(`${EXPRESS_API_URL}/api/lobbies/deleteAll`, {
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

// Error handler for Axios
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
