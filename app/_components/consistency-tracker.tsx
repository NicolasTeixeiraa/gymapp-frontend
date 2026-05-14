import Link from "next/link";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type GetHomeData200 } from "@/app/_lib/api/fetch-generated";
import { ConsistencySquare } from "./consistency-square";

const DAY_LABELS = ["S", "T", "Q", "Q", "S", "S", "D"];

type ConsistencyTrackerProps = {
  weekDates: string[];
  consistencyByDay: GetHomeData200["consistencyByDay"];
  workoutStreak: number;
};

export function ConsistencyTracker({
  weekDates,
  consistencyByDay,
  workoutStreak,
}: ConsistencyTrackerProps) {
  return (
    <section className="flex flex-col gap-3 px-5 pt-5 md:flex-1 md:p-0">
      <div className="flex items-center justify-between">
        <p className="font-heading text-lg font-semibold text-foreground">
          Consistência
        </p>
        <Button variant="link" className="font-heading text-xs text-primary h-auto p-0" asChild>
          <Link href="/stats">Ver histórico</Link>
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center justify-between rounded-xl border border-border p-5">
          {weekDates.map((date, i) => {
            const status = consistencyByDay[date];
            return (
              <ConsistencySquare
                key={date}
                label={DAY_LABELS[i]}
                workoutDayCompleted={status?.workoutDayCompleted ?? false}
                workoutDayStarted={status?.workoutDayStarted ?? false}
              />
            );
          })}
        </div>
        <div className="flex shrink-0 self-stretch items-center justify-center gap-2 rounded-xl bg-streak px-5 py-2">
          <Flame size={20} className="text-streak-foreground" />
          <p className="font-heading text-base font-semibold text-foreground">
            {workoutStreak}
          </p>
        </div>
      </div>
    </section>
  );
}
