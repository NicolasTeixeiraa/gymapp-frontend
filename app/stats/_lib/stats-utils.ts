import dayjs from "dayjs";
import { type GetStats200ConsistencyByDay } from "@/app/_lib/api/fetch-generated";

const MONTH_NAMES_PT = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export type HeatmapDay = {
  date: string | null;
  workoutDayCompleted: boolean;
  workoutDayStarted: boolean;
};

export type HeatmapMonth = {
  label: string;
  days: HeatmapDay[];
};

export function buildHeatmapData(
  consistencyByDay: GetStats200ConsistencyByDay,
  today: dayjs.Dayjs
): HeatmapMonth[] {
  return [2, 1, 0].map((monthsAgo) => {
    const monthDate = today.subtract(monthsAgo, "month");
    const year = monthDate.year();
    const month = monthDate.month();
    const daysInMonth = dayjs(new Date(year, month + 1, 0)).date();

    const days: HeatmapDay[] = Array.from({ length: 32 }, (_, i) => {
      const dayNum = i + 1;
      if (dayNum > daysInMonth) {
        return { date: null, workoutDayCompleted: false, workoutDayStarted: false };
      }
      const dateStr = dayjs(new Date(year, month, dayNum)).format("YYYY-MM-DD");
      const dayData = consistencyByDay[dateStr];
      return {
        date: dateStr,
        workoutDayCompleted: dayData?.workoutDayCompleted ?? false,
        workoutDayStarted: dayData?.workoutDayStarted ?? false,
      };
    });

    return {
      label: MONTH_NAMES_PT[month],
      days,
    };
  });
}

export function formatTotalTime(totalTimeInSeconds: number): string {
  const hours = Math.floor(totalTimeInSeconds / 3600);
  const minutes = Math.floor((totalTimeInSeconds % 3600) / 60);

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}
