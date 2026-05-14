export type HomeWorkoutLoadIssue = "no-active-plan" | "server";

type HomeWorkoutLoadMessageProps = {
  issue: HomeWorkoutLoadIssue;
};

export function HomeWorkoutLoadMessage({ issue }: HomeWorkoutLoadMessageProps) {
  if (issue === "no-active-plan") {
    return (
      <p className="font-heading text-sm text-muted-foreground">
        Nenhum plano de treino ativo. Ative um plano para ver o treino do dia.
      </p>
    );
  }

  return (
    <p className="font-heading text-sm text-muted-foreground">
      Não foi possível carregar seus dados. Tente novamente em instantes.
    </p>
  );
}
