import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import dayjs from "dayjs";
import { authClient } from "@/app/_lib/auth-client";
import { getHomeData, getUserTrainData } from "@/app/_lib/api/fetch-generated";
import { ChatBot } from "@/app/_components/chat-bot";
import { Button } from "@/components/ui/button";

export default async function OnboardingPage() {
  const { data: sessionData, error: sessionError } =
    await authClient.getSession({
      fetchOptions: { headers: await headers() },
    });

  if (sessionError || !sessionData?.user) redirect("/auth");

  const today = dayjs();
  const [homeData, trainData] = await Promise.all([
    getHomeData(today.format("YYYY-MM-DD")),
    getUserTrainData(),
  ]);

  if (homeData.status === 401 || trainData.status === 401) redirect("/auth");

  const hasTrainData = trainData.status === 200 && trainData.data !== null;
  const hasActivePlan = homeData.status === 200;

  if (hasTrainData && hasActivePlan) redirect("/");

  return (
    <div className="flex h-svh flex-col">
      <header className="shrink-0 flex items-center justify-between border-b border-border px-4 py-3">
        <p className="font-anton text-lg uppercase tracking-wide text-foreground">
          Gym App
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/">Acessar Gym App</Link>
        </Button>
      </header>
      <ChatBot
        fullscreen
        initialMessage="Quero começar a melhorar a minha saúde"
      />
    </div>
  );
}
