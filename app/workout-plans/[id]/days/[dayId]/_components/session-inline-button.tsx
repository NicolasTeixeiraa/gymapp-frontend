"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { startWorkoutSessionAction } from "../actions";

type Props = {
  planId: string;
  dayId: string;
  state: "none" | "completed";
};

export function SessionInlineButton({ planId, dayId, state }: Props) {
  const [isPending, startTransition] = useTransition();

  if (state === "completed") {
    return (
      <div className="flex items-center justify-center rounded-full bg-primary-foreground/16 px-3 py-1.5 backdrop-blur-xs">
        <span className="font-heading text-xs font-semibold text-primary-foreground">
          Concluído!
        </span>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      className="rounded-full font-heading text-xs font-semibold shrink-0"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await startWorkoutSessionAction(planId, dayId);
        });
      }}
    >
      {isPending ? "Iniciando..." : "Iniciar treino"}
    </Button>
  );
}
