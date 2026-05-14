"use server";

import { revalidatePath } from "next/cache";
import {
  startWorkoutSession,
  updateWorkoutSession,
} from "@/app/_lib/api/fetch-generated";

export async function startWorkoutSessionAction(planId: string, dayId: string) {
  await startWorkoutSession(planId, dayId);
  revalidatePath(`/workout-plans/${planId}/days/${dayId}`);
}

export async function completeWorkoutSessionAction(
  planId: string,
  dayId: string,
  sessionId: string,
) {
  await updateWorkoutSession(planId, dayId, sessionId, {
    completedAt: new Date().toISOString(),
  });
  revalidatePath(`/workout-plans/${planId}/days/${dayId}`);
}
