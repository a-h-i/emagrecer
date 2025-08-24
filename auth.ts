import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { TypeORMAdapter } from "@auth/typeorm-adapter"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    signIn: '/login'
  },
  adapter: TypeORMAdapter({
    type: "postgres",
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT!, 10),
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
    synchronize: true,
  }),
  session: {
    strategy: "jwt",
  }
})