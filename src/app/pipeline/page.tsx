import Link from "next/link";

import { getPersonas } from "@/features/personas/queries";
import { PipelineBoard } from "@/features/personas/components/pipeline-board";
import { buttonVariants } from "@/components/ui/button";

// Tablero en vivo: refleja siempre el estado actual de la BD.
export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const personas = await getPersonas();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Pipeline</h1>
          <p className="text-sm text-muted-foreground">
            El proceso de cada entrevista, de Contactados a Impacto.
          </p>
        </div>
        <Link className={buttonVariants()} href="/personas/nueva">
          Nueva persona
        </Link>
      </div>
      <PipelineBoard personas={personas} />
    </div>
  );
}
