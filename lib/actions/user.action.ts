"use server";
import db from "@/db";
import { users } from "@/db/schema";
import { hashSync } from "bcrypt-ts-edge";
import { auth, signIn, signOut } from "@/auth";
import { eq } from "drizzle-orm";
import { ShippingAddress } from "@/types";
import { formatError } from "../utils";
import { shippingAddressSchema } from "../validators";

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

// Get user by id
export async function getUserById(userId: string) {
  const [userInDb] = await db.select().from(users).where(eq(users.id, userId));
  if (!userInDb) throw new Error("user not found");

  return userInDb;
}

// Update user's address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();
    if (!session || !session.user) throw new Error("Unauthenticated");
    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, session?.user?.id));

    if (!currentUser) throw new Error("User not found");
    const address = shippingAddressSchema.parse(data);

    await db
      .update(users)
      .set({
        address: address,
      })
      .where(eq(users.id, currentUser.id));

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
