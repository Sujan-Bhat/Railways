// pages/api/auth/[...nextauth].ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import pool from "../../../lib/db";

// Create your NextAuth options.
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const [users]: any = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [credentials?.email]
          );
          if (!users || users.length === 0) {
            throw new Error("No user found with this email");
          }
          const user = users[0];
          
          const isValid = await compare(credentials!.password, user.password);
          if (!isValid) {
            throw new Error("Incorrect password");
          }
          
          // Return required user object.
          return { id: user.user_id, email: user.email, name: user.fullname };
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as number;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

