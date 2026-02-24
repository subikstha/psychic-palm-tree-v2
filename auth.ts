import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { compareSync } from "bcrypt-ts-edge";
import { NextResponse } from "next/server";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      // This will be called when we programmatically call the signIn function provided by next auth
      async authorize(credentials, req) {
        if (credentials == null) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string));

        if (user && user.password) {
          const doesPasswordMatch = compareSync(
            credentials.password as string,
            user.password,
          );

          if (doesPasswordMatch) {
            return {
              id: String(user.id),
              name: user.name,
              email: user.email,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    authorized({ request }: { request: any }) {
      // Check for session cart cookie
      if (!request.cookies.get("sessionCartId")) {
        // Generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();
        console.log("sessionCartId", sessionCartId);
        // Clone the request headers
        const newRequestHeaders = new Headers(request.headers);

        // Create new response and add the headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        // Set newly generated sessionCartId to the response cookie
        response.cookies.set("sessionCartId", sessionCartId);
        return response;
      } else {
        return true;
      }
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
