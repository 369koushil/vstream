import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from 'zod'
import { authOptions } from "@/app/utils/authopt";


const createStreamSchema = z.object({
    title: z.string()
})


export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        console.log(session)
        if (!session!.user) {
            return NextResponse.json({ msg: "unauthorized" }, { status: 401 })
        }
        const body = await req.json()
        const parsedBody = createStreamSchema.safeParse(body);
        if (!parsedBody.success) {
            return NextResponse.json({
                msg: "Validation failed",
                errors: parsedBody.error.format()
            }, { status: 400 });
        }
        const newStream = await prisma.stream.create({
            data: {
                hostId: session!.user.id.toString(),
                title: body.title
            }
        })

        return NextResponse.json({ msg: "create new stream", newStream }, { status: 201 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ msg: "error occured failed to create stream" }, { status: 500 })
    }
}


export async function GET(req:NextRequest){
    try{
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ msg: "unauthorized" }, { status: 401 })
        }
        const streamId=req.nextUrl.searchParams.get("streamId")
       
        const streamData=await prisma.stream.findUnique({
            where:{
                id:streamId||"1234"
            }
        })

        return NextResponse.json({streamData},{status:201})
    }catch(err){
        console.log(err)
        return NextResponse.json({ msg: "error occured failed to fetch stream" }, { status: 500 })
    }
}

