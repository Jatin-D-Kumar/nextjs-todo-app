// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Mock API call to your login endpoint
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          }
        );
        const user = await res.json();

        if (res.ok && user) {
          return user;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login", // redirect to the custom login page
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        // Store token and user details in JWT
        token.email = user?.data?.email;
        token.name = user?.data?.name;
        token.token = user?.data?.token; // Store the token
      }
      return token;
    },
    async session({ session, token }: any) {
      // Add token and user data to session
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.token = token.token; // Add token to session
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

