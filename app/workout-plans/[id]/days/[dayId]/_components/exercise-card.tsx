"use client";

import { CircleHelp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type GetWorkoutDay200ExercisesItem } from "@/app/_lib/api/fetch-generated";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";

type Props = {
  exercise: GetWorkoutDay200ExercisesItem;
};

export function ExerciseCard({ exercise }: Props) {
  const [, setChatOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false),
  );
  const [, setChatInitialMessage] = useQueryState(
    "chat_initial_message",
    parseAsString.withDefault(""),
  );

  const handleHelpClick = () => {
    setChatInitialMessage(
      `Como executar o exercício ${exercise.name} corretamente?`,
    );
    setChatOpen(true);
  };

  return (
    <div className="flex items-start rounded-xl border border-border p-5">
      <div className="flex flex-1 flex-col gap-3 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-heading text-base font-semibold text-foreground">
            {exercise.name}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 text-muted-foreground"
            onClick={handleHelpClick}
          >
            <CircleHelp size={20} />
          </Button>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <span className="px-2.5 py-1 rounded-full bg-secondary text-muted-foreground font-heading text-xs font-semibold uppercase">
            {exercise.sets} séries
          </span>
          <span className="px-2.5 py-1 rounded-full bg-secondary text-muted-foreground font-heading text-xs font-semibold uppercase">
            {exercise.reps} reps
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-muted-foreground font-heading text-xs font-semibold uppercase">
            <Zap size={14} />
            {exercise.restTimeInSeconds}s
          </span>
        </div>
      </div>
    </div>
  );
}
