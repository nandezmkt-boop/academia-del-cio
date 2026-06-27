import { getPersonas } from "@/features/personas/queries";
import { PipelineBoard } from "@/features/personas/components/pipeline-board";

// Tablero en vivo: refleja siempre el estado actual de la BD.
export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const personas = await getPersonas();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Pipeline</h1>
        <p className="text-sm text-muted-foreground">
          Mueve a cada líder por su estado de relación.
        </p>
      </div>
      <PipelineBoard personas={personas} />
    </div>
  );
}
