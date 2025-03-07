import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import prisma from "./db";


export const authOptions: NextAuthOptions = {
    debug: true, 
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],

    callbacks: {
        async signIn({user}){
            let existingUser = await prisma.user.findUnique({where:{email:user.email!}})
            if(!existingUser){
                await prisma.user.create({
                    data:{
                        email:user.email!,
                        image:user.image!
                    }
                })
            }
            
            return true;
        }
        ,
        async jwt({ user, token ,session,trigger}) {

           

            if (user) {
                const dbUser = await prisma.user.findUnique({
                  where: { email: user.email! },
                });
        
                if (dbUser) {
                  token.userId = dbUser.id;
                  token.streamId = dbUser.streamId ?? null;
                  token.hostId=null;
                }

              }

              if (trigger === "update") {
                token.streamId = session.streamId as string ?? null;
                token.hostId = session.hostId as string ?? null;
            }
            console.log(token)
              return token;

        },
        async session({ session, token }) {
            if (session.user && token.userId) {
                session.user.id = token.userId as string
                session.user.streamId=token.streamId as string|| null
                session.user.hostId=token.hostId as string|| null
            }
            return session
        },

    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.AUTH_SECRET
}