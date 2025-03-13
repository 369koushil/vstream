import { NextApiRequest, NextApiResponse } from "next";
import { createProxyMiddleware } from "http-proxy-middleware";
import { IncomingMessage, ServerResponse } from "http";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const proxy = createProxyMiddleware({
    target: "ws://ec2-54-84-77-154.compute-1.amazonaws.com:4000", // Replace with your EC2 instance
    ws: true, // Enable WebSocket proxying
    changeOrigin: true,
  });

  // Correctly apply the proxy to Next.js API request
  return new Promise<void>((resolve, reject) => {
    proxy(req as unknown as IncomingMessage, res as unknown as ServerResponse, (result) => {
      if (result instanceof Error) {
        reject(result);
      } else {
        resolve();
      }
    });
  });
}

// Required for WebSockets & Next.js API Routes
export const config = {
  api: {
    bodyParser: false, // Must be false for WebSocket support
  },
};
