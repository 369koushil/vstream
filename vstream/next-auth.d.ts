import { DefaultSession } from "next-auth";

declare module 'next-auth'{
     interface Session{
        user:{
            id:String;
            streamId:string|null;
            hostId:string|null;
        }&DefaultSession['user']
     }
}