import { cn } from "@/lib/utils";
import { type HeatmapMonth } from "../_lib/stats-utils";

type StatsHeatmapProps = {
  months: HeatmapMonth[];
};

export function StatsHeatmap({ months }: StatsHeatmapProps) {
  return (
    <div className="flex w-full gap-3">
      {months.map((month) => (
        <div key={month.label} className="flex flex-1 flex-col gap-2">
          <p className="font-heading text-sm font-semibold text-foreground">
            {month.label}
          </p>
          <div className="grid grid-cols-4 gap-1">
            {month.days.map((day, i) => (
              <div
                key={i}
                className={cn("aspect-square rounded-sm", {
                  "bg-primary": day.workoutDayCompleted,
                  "bg-primary/30": day.workoutDayStarted && !day.workoutDayCompleted,
                  "border border-border":
                    day.date !== null &&
                    !day.workoutDayCompleted &&
                    !day.workoutDayStarted,
                  invisible: day.date === null,
                })}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
