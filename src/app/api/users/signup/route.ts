import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@prisma/prismaClient";
import { handleResponse } from "@utils/handleResponse";
import { nextErrorHandler } from "@utils/nextErrorHandler";
// import { updateUserList } from "@lib/sockets/sockets";

const JWT_SECRET = process.env.JWT_SECRET;

const signupUser = async (name: string, email: string, password: string) => {

  if (!name || !email || !password) {
    return { message: "All fields are required", status: 400 };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // updateUserList();

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "100h" } 
    );

    return {
      message: "User created and logged in",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      },
      status: 201,      
    };
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
};

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ message: "All fields are required" }, { status: 400 });
  }

  const response = await signupUser(name,  email, password);
  return handleResponse(response);
}
