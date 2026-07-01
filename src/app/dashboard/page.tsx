import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Academia del CIO",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visión general de la actividad. Próximamente: métricas del pipeline y
          del impacto de las entrevistas.
        </p>
      </div>
      <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
        Aún no hay widgets. Esta sección se construirá en una fase posterior.
      </div>
    </div>
  );
}
