import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable must be defined");
}

interface DecodedToken {
  id: number;
  email: string;
}

export const verifyToken = async (req: NextRequest): Promise<DecodedToken | null> => {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    console.log("NO TOKEN");
    NextResponse.json({ error: 'Unauthorized: Invalid token format' }, { status: 401 });
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (err) {
    console.log("ERROR VERIFYING TOKEN", err);
    NextResponse.json({ error: 'Unauthorized: Token verification failed'}, { status: 401 });
    return null;
  }
};
