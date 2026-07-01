import Link from "next/link";
import type { Persona } from "@prisma/client";

import { ESTADO_RELACION } from "../constants";
import { EstadoSelect } from "./estado-select";

function formatFechaCorta(fecha: Date) {
  return fecha.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
}

/** Tarjeta de una persona dentro del tablero de pipeline. */
export function PersonaCard({ persona }: { persona: Persona }) {
  const subtitulo = [persona.cargoActual, persona.empresaActual]
    .filter(Boolean)
    .join(" · ");

  const hoy = new Date().toISOString().slice(0, 10);
  const fechaStr = persona.fechaSeguimiento
    ? persona.fechaSeguimiento.toISOString().slice(0, 10)
    : null;
  const vencido = fechaStr ? fechaStr < hoy : false;

  // Fecha propia de la etapa actual (llamada, entrevista o publicación prevista).
  const fechaEtapaCfg = ESTADO_RELACION[persona.estadoRelacion].fecha;
  const fechaEtapa = fechaEtapaCfg ? persona[fechaEtapaCfg.campo] : null;

  return (
    <div className="space-y-2 rounded-lg border bg-card p-3 shadow-xs">
      <Link
        href={`/personas/${persona.id}`}
        className="font-medium hover:underline"
      >
        {persona.nombre}
      </Link>
      {subtitulo && (
        <p className="text-xs text-muted-foreground">{subtitulo}</p>
      )}
      {persona.proximaAccion && (
        <p className="text-xs">{persona.proximaAccion}</p>
      )}
      {fechaEtapaCfg && fechaEtapa && (
        <p className="text-xs text-muted-foreground">
          {fechaEtapaCfg.labelCorto}: {formatFechaCorta(fechaEtapa)}
        </p>
      )}
      {persona.fechaSeguimiento && (
        <p
          className={
            "text-xs " + (vencido ? "text-destructive" : "text-muted-foreground")
          }
        >
          Seguimiento: {formatFechaCorta(persona.fechaSeguimiento)}
          {vencido ? " · vencido" : ""}
        </p>
      )}
      <EstadoSelect
        personaId={persona.id}
        estado={persona.estadoRelacion}
        triggerClassName="w-full"
      />
    </div>
  );
}
