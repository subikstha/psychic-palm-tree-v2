import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { compareSync } from "bcrypt-ts-edge";
import { NextResponse } from "next/server";
import type { NextAuthConfig } from "next-auth";

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

      // The authorize function will be used to do all the logic to query the DB and find the users
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
              role: user.role,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    // The JWT callback is used to change the jwt token for example to change the role of the user
    async session({ session, user, trigger, token }) {
      // Set the user id from the token to the session
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      // To ensure that when name changes in the DB, it also gets changed in the session
      if (trigger === "update" && user) {
        session.user.name = user.name;
      }
      return session;
    },
    authorized({ request }) {
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
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);
