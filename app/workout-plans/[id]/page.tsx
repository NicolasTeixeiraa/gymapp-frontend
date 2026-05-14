import Image from "next/image";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Goal } from "lucide-react";
import { authClient } from "@/app/_lib/auth-client";
import { getWorkoutPlan } from "@/app/_lib/api/fetch-generated";
import { BottomNav } from "@/app/_components/bottom-nav";
import { WorkoutDayCard } from "./_components/workout-day-card";

export default async function WorkoutPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: sessionData, error: sessionError } =
    await authClient.getSession({
      fetchOptions: { headers: await headers() },
    });

  if (sessionError || !sessionData?.user) redirect("/auth");

  const workoutPlanData = await getWorkoutPlan(id);
  if (workoutPlanData.status === 401) redirect("/auth");
  if (workoutPlanData.status !== 200) return null;

  const plan = workoutPlanData.data;

  const WEEKDAY_ORDER = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  const sortedDays = [...plan.workoutDays].sort(
    (a, b) => WEEKDAY_ORDER.indexOf(a.weekDay) - WEEKDAY_ORDER.indexOf(b.weekDay),
  );

  const bannerImageUrl = sortedDays.find((d) => d.coverImageUrl)?.coverImageUrl;

  return (
    <div className="flex min-h-svh flex-col pb-22 md:pb-0 md:pl-60">
      <div className="relative flex h-[296px] shrink-0 flex-col items-start justify-between overflow-hidden rounded-b-[20px] pb-10 pt-5 px-5">
        {bannerImageUrl ? (
          <Image
            src={bannerImageUrl}
            alt={plan.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-foreground" />
        )}
        <div className="absolute inset-0 bg-linear-to-tr from-overlay/80 to-transparent" />

        <p className="font-anton relative text-[22px] uppercase leading-[1.15] text-primary-foreground">
          Gym App
        </p>

        <div className="relative flex w-full items-end justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex w-fit items-center gap-1 rounded-full bg-primary px-2.5 py-1.5">
              <Goal size={16} className="text-primary-foreground" />
              <span className="font-heading text-[12px] font-semibold uppercase leading-none text-primary-foreground">
                {plan.name}
              </span>
            </div>
            <p className="font-heading text-2xl font-semibold leading-[1.05] text-primary-foreground">
              Plano de Treino
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5">
        {sortedDays.map((day) => (
          <WorkoutDayCard key={day.id} day={day} planId={id} />
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
