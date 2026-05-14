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

  const forwardHeaders = new Headers();
  response.headers.forEach((value, key) => {
    if (!["content-encoding", "content-length", "transfer-encoding"].includes(key)) {
      forwardHeaders.set(key, value);
    }
  });

  return new Response(response.body, {
    status: response.status,
    headers: forwardHeaders,
  });
}
