import NextAuth from "next-auth";

import Credentials from "next-auth/providers/credentials";

import api from "@/lib/axios";

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},

        password: {},
      },

      async authorize(
        credentials
      ) {
        try {
          const response =
            await api.post(
              "/auth/login",
              {
              email:
                credentials?.email as string,

              password:
                credentials?.password as string,
                            }
            );

          const data =
            response.data;

          if (!data.token) {
            return null;
          }

          return {
            id: data.user.id,

            name: data.user.name,

            email:
              data.user.email,

            role:
              data.user.role,

            accessToken:
              data.token,
          };
        } catch (error) {
          console.log(error);

          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({
      token,
      user,
    }) {
      if (user) {
        token.id = user.id;

        token.role =
          user.role;

        token.accessToken =
          user.accessToken;
      }

      return token;
    },

    async session({
      session,
      token,
    }) {
      if (session.user) {
        session.user.id =
          token.id as string;

        session.user.role =
          token.role as string;

        session.user.accessToken =
          token.accessToken as string;
      }

      return session;
    },
  },

  pages: {
    signIn:
      "/auth/login",
  },

  secret:
    process.env.NEXTAUTH_SECRET,
});