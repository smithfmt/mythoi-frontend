import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@prisma/prismaClient";
import { handleResponse } from "@utils/handleResponse";
import { nextErrorHandler } from "@utils/nextErrorHandler";

const JWT_SECRET = process.env.JWT_SECRET;


const loginUser = async (email: string, password: string) => {

  if (!email || !password) {
    return { status: 400, message: "All fields are required" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { status: 401, message: "Invalid email or password" };
    }
    
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '100h',
    });

    return { status: 200, message: "Login successful",  data: { token } };
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
};

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
  }

  const response = await loginUser(email,password);
  return handleResponse(response);
}
