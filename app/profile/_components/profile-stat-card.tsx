import { type LucideIcon } from "lucide-react";

type ProfileStatCardProps = {
  icon: LucideIcon;
  value: string;
  label: string;
};

export function ProfileStatCard({ icon: Icon, value, label }: ProfileStatCardProps) {
  return (
    <div className="flex aspect-square flex-col items-start justify-between rounded-xl border border-border p-4">
      <Icon size={22} className="text-muted-foreground" />
      <div className="flex flex-col gap-0.5">
        <p className="font-heading text-2xl font-bold text-foreground leading-none">
          {value}
        </p>
        <p className="font-heading text-xs text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );
}
