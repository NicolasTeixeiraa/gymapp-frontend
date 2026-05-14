import Image from "next/image";
import Link from "next/link";
import { Calendar, Dumbbell, Timer } from "lucide-react";
import type { GetHomeData200TodayWorkoutDay } from "@/app/_lib/api/fetch-generated";

const WEEKDAY_PT: Record<string, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

type Props = {
  workoutDay: GetHomeData200TodayWorkoutDay;
};

export function WorkoutDayCard({ workoutDay }: Props) {
  const durationMinutes = Math.floor(
    workoutDay.estimatedDurationInSeconds / 60,
  );

  return (
    <Link
      href="#"
      className="relative flex h-50 w-full flex-col justify-between overflow-hidden rounded-xl p-5"
    >
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

      <div className="relative z-10 flex flex-col gap-2">
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
              {workoutDay.exercisesCount} exercícios
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
