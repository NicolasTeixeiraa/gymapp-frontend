import dayjs from "dayjs";
import { getHomeData } from "@/app/_lib/api/fetch-generated";
import { BottomNavLinks } from "./bottom-nav-links";

export async function BottomNav() {
  const homeData = await getHomeData(dayjs().format("YYYY-MM-DD"));

  let workoutDayHref: string | null = null;
  if (homeData.status === 200 && homeData.data.todayWorkoutDay) {
    const { workoutPlanId } = homeData.data.todayWorkoutDay;
    workoutDayHref = `/workout-plans/${workoutPlanId}`;
  }

  return <BottomNavLinks workoutDayHref={workoutDayHref} />;
}
