"use server";
import db from "@/db";
import { users } from "@/db/schema";
import { hashSync } from "bcrypt-ts-edge";

export const signUpWithCredentials = async (
  prevState: unknown,
  formData: FormData,
) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const hashedPassword = hashSync(password, 10);

  await db.insert(users).values({
    email,
    password: hashedPassword,
  });

  return {
    success: true,
    message: "User creation success",
  };
};

export const signIn = async (prevState: unknown, formData: FormData) => {
  return {
    success: true,
    message: "User signed in success",
  };
};
