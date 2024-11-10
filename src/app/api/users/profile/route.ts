import { NextRequest } from "next/server";

import prisma from "@prisma/prismaClient";
import { verifyToken } from "src/lib/auth/verifyToken";
import { handleResponse } from "@utils/handleResponse";
import { nextErrorHandler } from "@utils/nextErrorHandler";

const getUserProfile = async (user) => {
  if (!user) {
    return { message: "Unauthorized", status: 401 };
  }

  try {
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!profile) {
      return { message: "User not found", status: 404 };
    }

    return { message: "User profile retrieved", data: { profile }, status: 200 };
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
};


export async function GET(req: NextRequest) {
  const { user, error } = await verifyToken(req);
  if (error) return handleResponse(error);
  const response = await getUserProfile(user);
  return handleResponse(response);
}
