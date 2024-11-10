import { UserType } from "@app/api/types";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable must be defined");
}

interface TokenResponse {
  error?: { message: string, status: number },
  user: { id: number, email: string },
}

export const verifyToken = async (req: NextRequest): Promise<TokenResponse> => {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    console.log("NO TOKEN");
    return { error: { message: 'Unauthorized: Invalid token format', status: 401 }, user: { id: 0, email: "" }};
  }

  try {
    const { id, email } = jwt.verify(token, JWT_SECRET) as UserType;
    return { user: { id, email } };
  } catch {
    console.log("ERROR VERIFYING TOKEN");
    return { error: {message: 'Unauthorized: Token verification failed', status: 401 }, user: { id: 0, email: "" }};
  }
};
