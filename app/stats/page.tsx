import { redirect } from "next/navigation";
import { headers } from "next/headers";
import dayjs from "dayjs";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/app/_lib/auth-client";
import {
  getStats,
  getHomeData,
  getUserTrainData,
} from "@/app/_lib/api/fetch-generated";
import { BottomNav } from "@/app/_components/bottom-nav";
import { StatsHeatmap } from "./_components/stats-heatmap";
import { buildHeatmapData, formatTotalTime } from "./_lib/stats-utils";

export default async function StatsPage() {
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

  if (
    trainData.status !== 200 ||
    trainData.data === null ||
    homeData.status !== 200
  ) {
    redirect("/onboarding");
  }

  const from = today.subtract(2, "month").startOf("month").format("YYYY-MM-DD");
  const to = today.format("YYYY-MM-DD");

  const statsData = await getStats({ from, to });

  if (statsData.status === 401) redirect("/auth");

  let workoutStreak = 0;
  let completedWorkoutsCount = 0;
  let conclusionRate = 0;
  let totalTimeInSeconds = 0;
  let consistencyByDay: Record<string, { workoutDayCompleted: boolean; workoutDayStarted: boolean }> = {};

  if (statsData.status === 200) {
    ({
      workoutStreak,
      completedWorkoutsCount,
      conclusionRate,
      totalTimeInSeconds,
      consistencyByDay,
    } = statsData.data);
  }

  const heatmapMonths = buildHeatmapData(consistencyByDay, today);
  const conclusionRatePercent = Math.round(conclusionRate * 100);
  const formattedTime = formatTotalTime(totalTimeInSeconds);
  const hasStreak = workoutStreak > 0;

  return (
    <div className="flex min-h-svh flex-col pb-22 md:pb-0 md:pl-60">
      <div className="flex flex-col gap-4 p-5">
        <p className="font-heading text-lg font-semibold text-foreground">
          Estatísticas
        </p>

        <div
          className={cn(
            "flex items-center gap-4 rounded-2xl p-5",
            hasStreak ? "bg-streak" : "bg-secondary"
          )}
        >
          <Flame
            size={32}
            className={cn(hasStreak ? "text-streak-foreground" : "text-muted-foreground")}
          />
          <div className="flex flex-col gap-0.5">
            <p className="font-heading text-3xl font-bold text-foreground leading-none">
              {workoutStreak}
            </p>
            <p
              className={cn(
                "font-heading text-sm leading-none",
                hasStreak ? "text-streak-foreground" : "text-muted-foreground"
              )}
            >
              dias de sequência
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-border p-5">
          <p className="font-heading text-base font-semibold text-foreground">
            Consistência
          </p>
          <StatsHeatmap months={heatmapMonths} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 rounded-xl border border-border p-4">
            <p className="font-heading text-2xl font-bold text-foreground leading-none">
              {completedWorkoutsCount}
            </p>
            <p className="font-heading text-xs text-muted-foreground mt-1">
              Treinos completos
            </p>
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-border p-4">
            <p className="font-heading text-2xl font-bold text-foreground leading-none">
              {conclusionRatePercent}%
            </p>
            <p className="font-heading text-xs text-muted-foreground mt-1">
              Taxa de conclusão
            </p>
          </div>
          <div className="col-span-2 flex flex-col gap-1 rounded-xl border border-border p-4">
            <p className="font-heading text-2xl font-bold text-foreground leading-none">
              {formattedTime}
            </p>
            <p className="font-heading text-xs text-muted-foreground mt-1">
              Tempo total de treino
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
