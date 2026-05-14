"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/app/_lib/auth-client";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const { error } = await authClient.signOut();
    if (!error) router.push("/auth");
  }

  return (
    <Button
      variant="ghost"
      className="w-full justify-center gap-2 font-heading font-medium text-destructive hover:text-destructive"
      onClick={handleLogout}
    >
      Sair da conta
      <LogOut size={18} />
    </Button>
  );
}
