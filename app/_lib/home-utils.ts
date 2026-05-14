import dayjs from "dayjs";
import { type GetHomeData200 } from "@/app/_lib/api/fetch-generated";

export function getWeekDates(today: dayjs.Dayjs): string[] {
  const dayOfWeek = today.day();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = today.subtract(daysFromMonday, "day");
  return Array.from({ length: 7 }, (_, i) =>
    monday.add(i, "day").format("YYYY-MM-DD"),
  );
}

export function buildEmptyConsistencyByDay(
  weekDates: string[],
): GetHomeData200["consistencyByDay"] {
  return Object.fromEntries(
    weekDates.map((d) => [
      d,
      { workoutDayCompleted: false, workoutDayStarted: false },
    ]),
  );
}
