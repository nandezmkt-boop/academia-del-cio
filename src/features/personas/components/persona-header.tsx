import Link from "next/link";
import type { Persona } from "@prisma/client";

import { buttonVariants } from "@/components/ui/button";
import { EstadoSelect } from "./estado-select";
import { ArchivarButton } from "./archivar-button";

export function PersonaHeader({ persona }: { persona: Persona }) {
  const subtitulo =
    [persona.cargoActual, persona.empresaActual].filter(Boolean).join(" · ") ||
    "Sin empresa ni cargo";

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{persona.nombre}</h1>
        <p className="text-sm text-muted-foreground">{subtitulo}</p>
        <EstadoSelect personaId={persona.id} estado={persona.estadoRelacion} />
      </div>
      <div className="flex gap-2">
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={`/personas/${persona.id}/editar`}
        >
          Editar
        </Link>
        <ArchivarButton personaId={persona.id} />
      </div>
    </div>
  );
}
