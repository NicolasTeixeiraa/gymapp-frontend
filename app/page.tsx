import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { authClient } from "@/app/_lib/auth-client";

export default async function Home() {
  const { data: session } = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session) redirect("/auth");

  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-foreground">Home page</p>
    </div>
  );
}
