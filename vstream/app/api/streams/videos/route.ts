import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import ytdl, { videoInfo } from "@distube/ytdl-core";
import { authOptions } from "@/app/utils/authopt";
import { v4 as uuidv4 } from "uuid";

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

export async function POST(req: NextRequest): Promise<NextResponse> {
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

        const extractedId: string | null = extractVideoId(body.url);
        if (!extractedId) {
            return NextResponse.json({ msg: "Invalid YouTube URL" }, { status: 400 });
        }

        let videoInfo: videoInfo;
        try {
            videoInfo = await ytdl.getInfo(extractedId);
        } catch (error) {
            console.error("Failed to fetch video details:", error);
            return NextResponse.json({ msg: "Failed to fetch video details", error }, { status: 500 });
        }

        const thumbnails = videoInfo.videoDetails.thumbnails || [];
        thumbnails.sort((a: { width: number }, b: { width: number }) => a.width - b.width);

        const uniqueId = uuidv4();
        const data = {
            id: uniqueId,
            title: videoInfo.videoDetails.title,
            extractId: extractedId,
            streamId: body.streamId,
            hostId: session.user.id.toString(),
            smg: thumbnails?.[1]?.url || "",
            big: thumbnails?.[thumbnails.length - 1]?.url || "",
            addedBy: body.addedBy,
        };

        return NextResponse.json({ streamVideos: data }, { status: 201 });
    } catch (err) {
        console.error("Error adding video:", err);
        return NextResponse.json({ msg: "Error occurred, failed to add video" }, { status: 500 });
    }
}
