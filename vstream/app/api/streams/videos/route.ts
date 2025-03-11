import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
// @ts-expect-error (Ensure types exist, or use any)
import youtube from "youtube-search-api";
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

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ msg: "unauthorized" }, { status: 401 });
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

        let res;
        try {
            res = await youtube.GetVideoDetails(extractedId);
        } catch (error) {
            return NextResponse.json({ msg: "Failed to fetch video details" }, { status: 500 });
        }

        const thumbnails = res.thumbnail?.thumbnails || [];
        thumbnails.sort((a: { width: number }, b: { width: number }) => (a.width < b.width ? -1 : 1));

        const fallbackImage =
            "https://imgs.search.brave.com/p-yZANTOLgHYlaDNBQ5r7caAKbb7fRxZuTL2EHy5uDs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9mYWtl/aW1nLnBsLzYwMHg0/MDA.jpeg";

        const uniqueId = uuidv4();
        const data = {
            id: uniqueId,
            title: res.title,
            extractId: extractedId,
            streamId: body.streamId,
            hostId: session.user.id.toString(),
            smg: thumbnails?.[1]?.url || fallbackImage,
            big: thumbnails?.[thumbnails.length - 1]?.url || fallbackImage,
            addedBy: body.addedBy,
        };

        return NextResponse.json({ streamVideos: data }, { status: 201 });
    } catch (err) {
        console.error("Error adding video:", err);
        return NextResponse.json({ msg: "Error occurred, failed to add video" }, { status: 500 });
    }
}
