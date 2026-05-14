import {
  ChartNoAxesColumn,
  Calendar,
  House,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function BottomNav() {
  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-center gap-6 rounded-tl-[20px] rounded-tr-[20px] border-t border-border bg-background px-6 py-4 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Home"
          className="text-foreground"
        >
          <House size={24} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Histórico"
          className="text-muted-foreground"
        >
          <Calendar size={24} />
        </Button>
        <Button size="icon" className="rounded-full size-14" aria-label="IA">
          <Sparkles size={24} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Estatísticas"
          className="text-muted-foreground"
        >
          <ChartNoAxesColumn size={24} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Perfil"
          className="text-muted-foreground"
        >
          <UserRound size={24} />
        </Button>
      </nav>

      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 flex-col border-r border-border bg-background px-3 py-6 gap-1">
        <p className="font-anton text-[22px] uppercase leading-none text-foreground px-3 mb-6">
          Gym App
        </p>
        <Button
          variant="secondary"
          className="w-full justify-start gap-3 font-heading font-medium"
          aria-label="Home"
        >
          <House size={20} />
          Home
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 font-heading font-medium text-muted-foreground"
          aria-label="Histórico"
        >
          <Calendar size={20} />
          Histórico
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 font-heading font-medium text-muted-foreground"
          aria-label="Estatísticas"
        >
          <ChartNoAxesColumn size={20} />
          Estatísticas
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 font-heading font-medium text-muted-foreground"
          aria-label="Perfil"
        >
          <UserRound size={20} />
          Perfil
        </Button>
        <div className="mt-2">
          <Button
            className="w-full justify-start gap-3 font-heading font-medium"
            aria-label="IA"
          >
            <Sparkles size={20} />
            IA
          </Button>
        </div>
      </aside>
    </>
  );
}
