import { handleAxiosError } from "@utils/handleAxiosError";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const EXPRESS_API_URL = process.env.EXPRESS_API_URL;
if (!EXPRESS_API_URL) throw new Error('No Express API URL');

const getAuthHeaders = (req: NextRequest) => {
  const token = req.headers.get('authorization') || '';
  return token ? { Authorization: `Bearer ${token.replace('Bearer ', '')}` } : {};
};

export async function POST(req: NextRequest) {
    const { action } = await req.json();
    try {
        let response;
        switch (action) {
            case 'deleteAll':
                response = await axios.delete(`${EXPRESS_API_URL}/api/games`, {
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
    const response = await axios.get(`${EXPRESS_API_URL}/api/games/all`, {
      headers: getAuthHeaders(req),
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
}
