import { cn } from "@/lib/utils";

type ConsistencySquareProps = {
  label: string;
  workoutDayCompleted: boolean;
  workoutDayStarted: boolean;
};

export function ConsistencySquare({
  label,
  workoutDayCompleted,
  workoutDayStarted,
}: ConsistencySquareProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={cn("size-5 rounded-[6px]", {
          "bg-primary": workoutDayCompleted,
          "bg-primary/30": workoutDayStarted && !workoutDayCompleted,
          "border border-border": !workoutDayStarted && !workoutDayCompleted,
        })}
      />
      <span className="font-heading text-xs text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
