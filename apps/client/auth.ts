import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { TypeORMAdapter } from '@auth/typeorm-adapter';
import { getOrCreateProfile } from '@emagrecer/control';
import assert from 'assert';
import { getDS } from '@/lib/getDS';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    signIn: '/login',
  },
  adapter: TypeORMAdapter({
    type: 'postgres',
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT!, 10),
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
    synchronize: false,
  }),
  session: {
    strategy: 'jwt',
  },

  events: {
    signIn: async ({ user }) => {
      assert(user.id != null, 'user id must be provided');
      const source = await getDS();
      await getOrCreateProfile(source, user.id);
    },
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
