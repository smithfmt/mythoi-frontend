import { verifyToken } from "@lib/auth/verifyToken";
import { handleResponse } from "@utils/handleResponse";
import { nextErrorHandler } from "@utils/nextErrorHandler";
import { NextRequest } from "next/server";
import { findUserById } from "@app/api/requests";

const getUser = async (id: string) => {
    try {
      // Fetch the game by its ID, including related players and playerData
        const userData = await findUserById(parseInt(id));
        if (!userData) return { message: "User not found", status: 404 };
        return { message: "Successfully fetched user", data: { userData }, status: 200 };
    } catch (error: unknown) {
      return nextErrorHandler(error);
    }
};

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { error } = await verifyToken(req);
    if (error) return handleResponse(error);
    const { id } = params;
    const response = await getUser(id);
    return handleResponse(response);
}