import Image from "next/image";
import Link from "next/link";
import { Calendar, Dumbbell, Timer, Zap } from "lucide-react";
import type { GetWorkoutPlan200WorkoutDaysItem } from "@/app/_lib/api/fetch-generated";

const WEEKDAY_PT: Record<string, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

type WorkoutDayCardProps = {
  day: GetWorkoutPlan200WorkoutDaysItem;
  planId: string;
};

export function WorkoutDayCard({ day, planId }: WorkoutDayCardProps) {
  const durationMinutes = Math.floor(day.estimatedDurationInSeconds / 60);
  const weekDayLabel = WEEKDAY_PT[day.weekDay];

  if (day.isRest) {
    return (
      <div className="flex h-[110px] flex-col justify-between rounded-xl bg-muted p-5">
        <div className="flex w-fit items-center gap-1 rounded-full bg-foreground/[0.08] px-2.5 py-1.5 backdrop-blur-xs">
          <Calendar size={14} className="text-foreground" />
          <span className="font-heading text-[12px] font-semibold uppercase leading-none text-foreground">
            {weekDayLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={20} className="text-foreground" />
          <p className="font-heading text-2xl font-semibold leading-[1.05] text-foreground">
            Descanso
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/workout-plans/${planId}/days/${day.id}`}
      className="relative flex h-[200px] flex-col justify-between overflow-hidden rounded-xl p-5"
    >
      {day.coverImageUrl ? (
        <Image
          src={day.coverImageUrl}
          alt={day.name}
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
          {weekDayLabel}
        </span>
      </div>

      <div className="relative z-10 flex flex-col gap-2">
        <p className="font-heading text-2xl font-semibold leading-[1.05] text-primary-foreground">
          {day.name}
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
              {day.exercisesCount} exercícios
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
