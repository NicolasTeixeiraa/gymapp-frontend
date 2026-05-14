"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { completeWorkoutSessionAction } from "../actions";

type Props = {
  planId: string;
  dayId: string;
  sessionId: string;
};

export function SessionButton({ planId, dayId, sessionId }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      className="w-full font-heading font-semibold rounded-full"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await completeWorkoutSessionAction(planId, dayId, sessionId);
        });
      }}
    >
      {isPending ? "Salvando..." : "Marcar como concluído"}
    </Button>
  );
}
