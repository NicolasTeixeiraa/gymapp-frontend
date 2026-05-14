import Image from "next/image";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Scale, Ruler, Dumbbell, UserRound } from "lucide-react";
import { authClient } from "@/app/_lib/auth-client";
import { getUserTrainData } from "@/app/_lib/api/fetch-generated";
import { BottomNav } from "@/app/_components/bottom-nav";
import { ProfileStatCard } from "./_components/profile-stat-card";
import { LogoutButton } from "./_components/logout-button";

function formatWeight(weight: number): string {
  return Number.isInteger(weight) ? weight.toString() : weight.toFixed(1);
}

export default async function ProfilePage() {
  const { data: sessionData, error: sessionError } =
    await authClient.getSession({
      fetchOptions: { headers: await headers() },
    });

  if (sessionError || !sessionData?.user) redirect("/auth");

  const trainData = await getUserTrainData();

  if (trainData.status === 401) redirect("/auth");

  const userData = trainData.status === 200 ? trainData.data : null;

  const firstName = sessionData.user.name.split(" ")[0];

  return (
    <div className="flex min-h-svh flex-col pb-22 md:pb-0 md:pl-60">
      <div className="flex flex-col gap-6 p-5">
        <div className="flex flex-col items-center gap-3 pt-4">
          {sessionData.user.image ? (
            <Image
              src={sessionData.user.image}
              alt={sessionData.user.name}
              width={80}
              height={80}
              className="rounded-full"
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-full bg-primary">
              <p className="font-heading text-2xl font-bold text-primary-foreground">
                {firstName.charAt(0).toUpperCase()}
              </p>
            </div>
          )}
          <p className="font-heading text-xl font-semibold text-foreground">
            {sessionData.user.name}
          </p>
        </div>

        {userData && (
          <div className="grid grid-cols-2 gap-3">
            <ProfileStatCard
              icon={Scale}
              value={`${formatWeight(userData.weightInGrams / 1000)} kg`}
              label="Peso"
            />
            <ProfileStatCard
              icon={Ruler}
              value={`${userData.heightInCentimeters} cm`}
              label="Altura"
            />
            <ProfileStatCard
              icon={Dumbbell}
              value={`${userData.bodyFatPercentage}%`}
              label="Gordura corporal"
            />
            <ProfileStatCard
              icon={UserRound}
              value={`${userData.age} anos`}
              label="Idade"
            />
          </div>
        )}

        <LogoutButton />
      </div>

      <BottomNav />
    </div>
  );
}
