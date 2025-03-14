import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/app/utils/authopt";
import { v4 as uuidv4 } from "uuid";

const NEXT_API_KEY = process.env.NEXT_API_KEY;

const addVideoSchema = z.object({
    url: z.string(),
    streamId: z.string(),
    addedBy: z.string().default("user"),
});

function extractVideoId(url: string): string | null {
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/|v\/|shorts\/))([^?&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const parsedBody = addVideoSchema.safeParse(body);
        if (!parsedBody.success) {
            return NextResponse.json(
                { msg: "Validation failed", errors: parsedBody.error.format() },
                { status: 400 }
            );
        }

        const extractedId = extractVideoId(body.url);
        if (!extractedId) {
            return NextResponse.json({ msg: "Invalid YouTube URL" }, { status: 400 });
        }

        const YT_API_URL = `https://www.googleapis.com/youtube/v3/videos?id=${extractedId}&key=${NEXT_API_KEY}&part=snippet,contentDetails,statistics`;

        const response = await fetch(YT_API_URL);
        const videoData = await response.json();
        console.log(response)
        console.log(videoData)

        if (!videoData.items || videoData.items.length === 0) {
            return NextResponse.json({ msg: "Video not found" }, { status: 404 });
        }

        const videoInfo = videoData.items[0].snippet;
        const thumbnails = videoInfo.thumbnails;

        const uniqueId = uuidv4();
        const data = {
            id: uniqueId,
            title: videoInfo.title,
            extractId: extractedId,
            streamId: body.streamId,
            hostId: session.user.id.toString(),
            smg: thumbnails.medium?.url || "",
            big: thumbnails.maxres?.url || thumbnails.high?.url || "",
            addedBy: body.addedBy,
        };

        return NextResponse.json({ streamVideos: data }, { status: 201 });
    } catch (err) {
        console.error("Error adding video:", err);
        return NextResponse.json({ msg: "Error occurred, failed to add video" }, { status: 500 });
    }
}
