"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function WorkoutDayTopbar() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-5 py-4">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Voltar"
        onClick={() => router.back()}
      >
        <ChevronLeft size={24} />
      </Button>
      <p className="font-heading text-lg font-semibold text-foreground">
        Treino de Hoje
      </p>
      <div className="size-10" />
    </div>
  );
}
