import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from 'zod'
//@ts-expect-error
import youtube from "youtube-search-api";
import { authOptions } from "@/app/utils/authopt";
import { v4 as uuidv4 } from "uuid";


const addVideoSchema = z.object({
    url: z.string(),
    streamId:z.string(),
    addedBy:z.string().default("user")
})

function extractVideoId(url: string): string | null {
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/|v\/|shorts\/))([^?&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}


export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session!.user) {
            return NextResponse.json({ msg: "unauthorized" }, { status: 401 })
        }
        const body = await req.json();
        const parsedBody = addVideoSchema.safeParse(body);
        if (!parsedBody.success) {
            return NextResponse.json({
                msg: "Validation failed",
                errors: parsedBody.error.format()
            }, { status: 400 });
        }  
        const extractedId=extractVideoId(body.url)
        console.log(extractedId)
        const res = await youtube.GetVideoDetails(extractedId)
        const thumbnails=res.thumbnail.thumbnails;
         thumbnails.sort((a:{width:number},b:{width:number})=>a.width<b.width?-1:1)
         const uniqueId = uuidv4();
            const data={
                id:uniqueId,
                title:res.title,
                extractId:extractedId as string,
                streamId:body.streamId,
                hostId:session!.user.id.toString(),
                smg:thumbnails[1].url??"https://imgs.search.brave.com/p-yZANTOLgHYlaDNBQ5r7caAKbb7fRxZuTL2EHy5uDs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9mYWtl/aW1nLnBsLzYwMHg0/MDA.jpeg",
                big:thumbnails[thumbnails.length-1].url??"https://imgs.search.brave.com/p-yZANTOLgHYlaDNBQ5r7caAKbb7fRxZuTL2EHy5uDs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9mYWtl/aW1nLnBsLzYwMHg0/MDA.jpeg",
                addedBy:body.addedBy
            }
        
         return NextResponse.json({streamVideos:data},{status:201})

    } catch (err) {
        console.log(err)
        return NextResponse.json({ msg: "error occured failed to add videos" }, { status: 500 })
    }
}




