"use server";
import db from "@/db";
import { users } from "@/db/schema";
import { hashSync } from "bcrypt-ts-edge";
import { signIn, signOut } from "@/auth";

// User action for registering new users
export const signUpWithCredentials = async (
  prevState: unknown,
  formData: FormData,
) => {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const hashedPassword = hashSync(password, 10);

  try {
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
      message: "User creation success",
    };
  } catch (error) {
    console.error("error when signing up", error);
    return {
      success: false,
      message: "User creation failed",
    };
  }
};

// User action for logging in existing users
export const signInWithCredentials = async (
  prevState: unknown,
  formData: FormData,
) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "type" in error &&
      error.type === "CredentialsSignin"
    ) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }
    // Auth.js uses redirect() which throws an error that should be re-thrown
    // to let Next.js handle the redirection.
    throw error;
  }
};

export async function signOutUser() {
  await signOut();
}
