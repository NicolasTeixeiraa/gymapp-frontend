import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import dayjs from "dayjs";
import { authClient } from "@/app/_lib/auth-client";
import { getHomeData, getUserTrainData } from "@/app/_lib/api/fetch-generated";
import { WorkoutDayCard } from "./_components/workout-day-card";
import { BottomNav } from "./_components/bottom-nav";
import { Button } from "@/components/ui/button";
import { ConsistencyTracker } from "./_components/consistency-tracker";
import { getWeekDates } from "@/app/_lib/home-utils";

export default async function Home() {
  const { data: sessionData, error: sessionError } =
    await authClient.getSession({
      fetchOptions: { headers: await headers() },
    });

  if (sessionError || !sessionData?.user) redirect("/auth");

  const today = dayjs();
  const weekDates = getWeekDates(today);
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

  const { todayWorkoutDay, workoutStreak, consistencyByDay } = homeData.data;
  const activePlanId = todayWorkoutDay?.workoutPlanId ?? null;

  return (
    <div className="flex min-h-svh flex-col pb-22 md:pb-0 md:pl-60">
      <div className="relative flex h-74 w-full flex-col items-start justify-between overflow-hidden rounded-b-4xl md:rounded-b-none px-5 pb-10 pt-5">
        <Image
          src="/login-bg.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(242.47deg,transparent_34.457%,var(--overlay)_100%)]"
          aria-hidden="true"
        />
        <p className="relative font-anton text-[22px] uppercase leading-[1.15] text-primary-foreground md:hidden">
          Gym App
        </p>
        <div className="relative flex w-full items-end justify-between">
          <div className="flex flex-col gap-1.5">
            <p className="font-heading text-2xl font-semibold leading-[1.05] text-primary-foreground">
              Olá, {sessionData.user.name.split(" ")[0]}
            </p>
            <p className="font-heading text-sm leading-[1.15] text-primary-foreground/70">
              Bora treinar hoje?
            </p>
          </div>
          {todayWorkoutDay && !todayWorkoutDay.isRest && (
            <Link
              href={`/workout-plans/${todayWorkoutDay.workoutPlanId}/days/${todayWorkoutDay.id}`}
              className="rounded-full bg-primary px-4 py-2"
            >
              <p className="font-heading text-sm font-semibold leading-none text-primary-foreground">
                Bora!
              </p>
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:gap-6 md:p-8 md:items-start">
        <ConsistencyTracker
          weekDates={weekDates}
          consistencyByDay={consistencyByDay}
          workoutStreak={workoutStreak}
        />

        <section className="flex flex-col gap-3 p-5 md:flex-1 md:p-0">
          <div className="flex items-center justify-between">
            <p className="font-heading text-lg font-semibold text-foreground">
              Treino de Hoje
            </p>
            <Button
              variant="link"
              className="font-heading text-xs text-primary h-auto p-0"
              disabled={!activePlanId}
              asChild={!!activePlanId}
            >
              {activePlanId ? (
                <Link href={`/workout-plans/${activePlanId}`}>Ver treinos</Link>
              ) : (
                "Ver treinos"
              )}
            </Button>
          </div>
          {todayWorkoutDay && <WorkoutDayCard workoutDay={todayWorkoutDay} />}
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
