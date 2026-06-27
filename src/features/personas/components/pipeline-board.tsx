import type { Persona } from "@prisma/client";

import { ESTADO_RELACION, ESTADOS_RELACION } from "../constants";
import { PersonaCard } from "./persona-card";

/**
 * Tablero del pipeline: una columna por estado de relación (ciclo de relación,
 * ADR 0004). Mover una tarjeta = cambiar su estado vía el EstadoSelect de la tarjeta.
 */
export function PipelineBoard({ personas }: { personas: Persona[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {ESTADOS_RELACION.map((estado) => {
        const items = personas.filter((p) => p.estadoRelacion === estado);
        return (
          <section key={estado} className="w-72 shrink-0">
            <header className="mb-2 flex items-center justify-between px-1">
              <h2 className="text-sm font-medium">
                {ESTADO_RELACION[estado].label}
              </h2>
              <span className="text-xs text-muted-foreground">
                {items.length}
              </span>
            </header>
            <div className="min-h-24 space-y-2 rounded-lg bg-muted/30 p-2">
              {items.length === 0 ? (
                <p className="px-1 py-6 text-center text-xs text-muted-foreground">
                  Vacío
                </p>
              ) : (
                items.map((persona) => (
                  <PersonaCard key={persona.id} persona={persona} />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
