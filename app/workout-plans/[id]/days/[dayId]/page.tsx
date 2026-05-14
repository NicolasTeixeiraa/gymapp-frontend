import Image from "next/image";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import dayjs from "dayjs";
import { Calendar, Dumbbell, Timer } from "lucide-react";
import { authClient } from "@/app/_lib/auth-client";
import {
  getWorkoutDay,
  getHomeData,
  getUserTrainData,
  type GetWorkoutDay200SessionsItem,
} from "@/app/_lib/api/fetch-generated";
import { BottomNav } from "@/app/_components/bottom-nav";
import { WorkoutDayTopbar } from "./_components/workout-day-topbar";
import { ExerciseCard } from "./_components/exercise-card";
import { SessionButton } from "./_components/session-button";
import { SessionInlineButton } from "./_components/session-inline-button";

const WEEKDAY_PT: Record<string, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

function getSessionState(
  sessions: GetWorkoutDay200SessionsItem[],
): "none" | "in-progress" | "completed" {
  if (sessions.some((s) => s.completedAt)) return "completed";
  if (sessions.some((s) => !s.completedAt)) return "in-progress";
  return "none";
}

export default async function WorkoutDayPage({
  params,
}: {
  params: Promise<{ id: string; dayId: string }>;
}) {
  const { id: planId, dayId } = await params;

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

  const workoutDayData = await getWorkoutDay(planId, dayId);
  if (workoutDayData.status === 401) redirect("/auth");
  if (workoutDayData.status !== 200) return null;

  const workoutDay = workoutDayData.data;
  const durationMinutes = Math.floor(
    workoutDay.estimatedDurationInSeconds / 60,
  );
  const sessionState = getSessionState(workoutDay.sessions);
  const inProgressSession = workoutDay.sessions.find((s) => !s.completedAt);

  return (
    <div className="flex min-h-svh flex-col pb-22 md:pb-0 md:pl-60">
      <WorkoutDayTopbar />

      <div className="flex flex-col gap-5 px-5 pb-5">
        <div className="relative flex h-50 w-full flex-col justify-between overflow-hidden rounded-xl p-5">
          {workoutDay.coverImageUrl ? (
            <Image
              src={workoutDay.coverImageUrl}
              alt={workoutDay.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-foreground" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-overlay/70 to-transparent" />

          <div className="relative z-10 flex w-fit items-center gap-1 rounded-full bg-primary-foreground/16 px-2.5 py-1.5 backdrop-blur-xs">
            <Calendar size={14} className="text-primary-foreground" />
            <span className="font-heading text-[12px] font-semibold uppercase leading-none text-primary-foreground">
              {WEEKDAY_PT[workoutDay.weekDay]}
            </span>
          </div>

          <div className="relative z-10 flex w-full items-end justify-between gap-3">
            <div className="flex flex-col gap-2">
              <p className="font-heading text-2xl font-semibold leading-[1.05] text-primary-foreground">
                {workoutDay.name}
              </p>
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <Timer size={14} className="text-primary-foreground/70" />
                  <span className="font-heading text-xs text-primary-foreground/70">
                    {durationMinutes}min
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Dumbbell size={14} className="text-primary-foreground/70" />
                  <span className="font-heading text-xs text-primary-foreground/70">
                    {workoutDay.exercises.length} exercícios
                  </span>
                </div>
              </div>
            </div>
            {sessionState !== "in-progress" && (
              <SessionInlineButton
                planId={planId}
                dayId={dayId}
                state={sessionState}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {workoutDay.exercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>

        {sessionState === "in-progress" && inProgressSession && (
          <SessionButton
            planId={planId}
            dayId={dayId}
            sessionId={inProgressSession.id}
          />
        )}
      </div>

      <BottomNav />
    </div>
  );
}
