import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize(credentials, req) {
        if (credentials == null) return null;
        return {
          id: "1",
          name: "user",
          email: "user@example.com",
        };
      },
    }),
  ],
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
