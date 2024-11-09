import { NextRequest } from "next/server";
import prisma from "@prisma/prismaClient";
import { verifyToken } from "@app/lib/auth/verifyToken";
import { handleResponse } from "@utils/handleResponse";
import { nextErrorHandler } from "@utils/nextErrorHandler";

const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return { message: "All Users", data: { users }, status: 200 };
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
};

export async function GET(req: NextRequest) {
  const { error } = await verifyToken(req);
  if (error) return handleResponse(error);
  const response = await getAllUsers();
  return handleResponse(response);
};
