import NextAuth from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

import axios from "axios";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          const response =
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
              {
                email:
                  credentials?.email,

                password:
                  credentials?.password,
              }
            );

          const data =
            response.data;

          console.log(data);

          // LOGIN GAGAL
          if (!data?.token) {
            return null;
          }

          // LOGIN BERHASIL
          return {
            id:
              data.user.id
                .toString(),

            name:
              data.user.name,

            email:
              data.user.email,

            role:
              data.user.role,

            accessToken:
              data.token,
          };
        } catch (error: any) {
          console.log(
            "NEXTAUTH ERROR:",
            error.response?.data ||
              error.message
          );

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

export {
  handler as GET,
  handler as POST,
};