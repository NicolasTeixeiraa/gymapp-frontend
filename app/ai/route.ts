import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();
  const requestHeaders = await headers();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: requestHeaders.get("cookie") ?? "",
    },
    body,
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") ?? "text/event-stream",
      "x-vercel-ai-data-stream":
        response.headers.get("x-vercel-ai-data-stream") ?? "",
    },
  });
}
