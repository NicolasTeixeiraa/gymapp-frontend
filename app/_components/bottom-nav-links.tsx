"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartNoAxesColumn,
  Calendar,
  House,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseAsBoolean, useQueryState } from "nuqs";

type Props = {
  workoutDayHref: string | null;
};

export function BottomNavLinks({ workoutDayHref }: Props) {
  const pathname = usePathname();
  const [, setChatOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false),
  );
  const isHome = pathname === "/";
  const isWorkoutDay = workoutDayHref !== null && pathname.startsWith(workoutDayHref);
  const isStats = pathname === "/stats";
  const isProfile = pathname === "/profile";

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-6 rounded-tl-[20px] rounded-tr-[20px] border-t border-border bg-background px-6 py-4 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Home"
          className={cn(isHome ? "text-foreground" : "text-muted-foreground")}
          asChild
        >
          <Link href="/">
            <House size={24} />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Treino de Hoje"
          className={cn(
            isWorkoutDay ? "text-foreground" : "text-muted-foreground",
          )}
          asChild={workoutDayHref !== null}
        >
          {workoutDayHref ? (
            <Link href={workoutDayHref}>
              <Calendar size={24} />
            </Link>
          ) : (
            <Calendar size={24} />
          )}
        </Button>
        <Button
          size="icon"
          className="rounded-full size-14"
          aria-label="IA"
          onClick={() => setChatOpen(true)}
        >
          <Sparkles size={24} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Estatísticas"
          className={cn(isStats ? "text-foreground" : "text-muted-foreground")}
          asChild
        >
          <Link href="/stats">
            <ChartNoAxesColumn size={24} />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Perfil"
          className={cn(isProfile ? "text-foreground" : "text-muted-foreground")}
          asChild
        >
          <Link href="/profile">
            <UserRound size={24} />
          </Link>
        </Button>
      </nav>

      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-50 w-60 flex-col border-r border-border bg-background px-3 py-6 gap-1">
        <p className="font-anton text-[22px] uppercase leading-none text-foreground px-3 mb-6">
          Gym App
        </p>
        <Button
          variant={isHome ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-3 font-heading font-medium",
            !isHome && "text-muted-foreground",
          )}
          aria-label="Home"
          asChild
        >
          <Link href="/">
            <House size={20} />
            Home
          </Link>
        </Button>
        <Button
          variant={isWorkoutDay ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-3 font-heading font-medium",
            !isWorkoutDay && "text-muted-foreground",
          )}
          aria-label="Treino de Hoje"
          asChild={workoutDayHref !== null}
        >
          {workoutDayHref ? (
            <Link href={workoutDayHref}>
              <Calendar size={20} />
              Histórico
            </Link>
          ) : (
            <>
              <Calendar size={20} />
              Histórico
            </>
          )}
        </Button>
        <Button
          variant={isStats ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-3 font-heading font-medium",
            !isStats && "text-muted-foreground",
          )}
          aria-label="Estatísticas"
          asChild
        >
          <Link href="/stats">
            <ChartNoAxesColumn size={20} />
            Estatísticas
          </Link>
        </Button>
        <Button
          variant={isProfile ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-3 font-heading font-medium",
            !isProfile && "text-muted-foreground",
          )}
          aria-label="Perfil"
          asChild
        >
          <Link href="/profile">
            <UserRound size={20} />
            Perfil
          </Link>
        </Button>
        <div className="mt-2">
          <Button
            className="w-full justify-start gap-3 font-heading font-medium"
            aria-label="IA"
            onClick={() => setChatOpen(true)}
          >
            <Sparkles size={20} />
            IA
          </Button>
        </div>
      </aside>
    </>
  );
}
