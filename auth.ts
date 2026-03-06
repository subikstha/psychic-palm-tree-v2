import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "./db";
import { cart, users } from "./db/schema";
import { eq } from "drizzle-orm";
import { compareSync } from "bcrypt-ts-edge";
import { NextResponse } from "next/server";
import type { NextAuthConfig } from "next-auth";
import { cookies } from "next/headers";

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
      async authorize(credentials) {
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
              role: user.role ?? "user",
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
      if (session.user && token.role) {
        session.user.role = token.role as string;
      }
      if (session.user && token.name) {
        session.user.name = token.name;
      }
      console.log("This is the token in the session after login", token);
      // To ensure that when name changes in the DB, it also gets changed in the session
      if (trigger === "update" && user && user.name) {
        session.user.name = user.name;
      }
      return session;
    },
    async jwt({ session, user, trigger, token }) {
      // Assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        // IF user has no name then use the email,
        // Even if the default has been set to no_name, the DB is empty when it comes to
        if (
          user.name?.toLowerCase() === "no_name" ||
          user.name?.toLowerCase() === ""
        ) {
          token.name = user.email!.split("@")[0];

          // Update the DB to reflect the token name
          try {
            await db
              .update(users)
              .set({
                name: token.name,
              })
              .where(eq(users.id, user.id));
          } catch (error) {
            console.error("Failed to update user name in DB:", error);
          }
        }

        // Need to check if the trigger is signIn or signUp in order to
        if (trigger === "signIn" || trigger === "signUp") {
          const cookie = await cookies();
          const cookieSessionCartId = cookie.get("sessionCartId");

          const sessionCartId = cookieSessionCartId?.value;
          if (sessionCartId) {
            // Delete the user's cart if any already exists
            await db.delete(cart).where(eq(cart.userId, user.id as string));

            // Assign newly logged in user to the current session cart
            await db
              .update(cart)
              .set({ userId: user.id as string })
              .where(eq(cart.sessionCartId, sessionCartId));
          }
        }
      }
      return token;
    },
    authorized({ auth, request }) {
      // Array of regex patterns of paths we want to protect
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/, // Here \ is used as the escape char and (.*) means anything after /user/, one or more chars
        /\/order\/(.*)/,
        /\/admin/,
      ];

      // Get the pathname from the req url object
      const { pathname } = request.nextUrl;

      // Check if user is not authenticated and accessing a protected path
      if (!auth && protectedPaths.some((path) => path.test(pathname))) {
        return false; // If we return false, the user gets redirected to the sign in page
      }

      // Role-based protection for /admin
      if (pathname.startsWith("/admin") && auth?.user?.role !== "admin") {
        return false;
      }
      // Check for session cart cookie
      if (!request.cookies.get("sessionCartId")) {
        // Generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();
        console.log("sessionCartId", sessionCartId);
        // Clone the request headers
        const newRequestHeaders = new Headers(request.headers);

        // Create new response and add the new headers
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
