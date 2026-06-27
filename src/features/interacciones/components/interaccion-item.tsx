"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Interaccion } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { CANAL, DIRECCION } from "../constants";
import { editarInteraccion, eliminarInteraccion } from "../actions";
import { InteraccionForm } from "./interaccion-form";

type ItemData = Interaccion & { autor: { nombre: string } };

export function InteraccionItem({
  interaccion,
  personaId,
}: {
  interaccion: ItemData;
  personaId: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const Icon = CANAL[interaccion.canal].icon;

  function handleEliminar() {
    if (!window.confirm("¿Eliminar esta interacción? Se puede recuperar (no se borra).")) {
      return;
    }
    startTransition(async () => {
      const res = await eliminarInteraccion(interaccion.id, personaId);
      if (res.ok) {
        toast.success("Interacción eliminada");
        router.refresh();
      } else {
        toast.error("No se pudo eliminar");
      }
    });
  }

  if (editing) {
    return (
      <div className="rounded-lg border p-3">
        <InteraccionForm
          defaultValues={{
            canal: interaccion.canal,
            direccion: interaccion.direccion,
            fecha: interaccion.fecha.toISOString().slice(0, 10),
            resumen: interaccion.resumen,
            resultado: interaccion.resultado ?? "",
          }}
          onSubmit={(values) =>
            editarInteraccion(interaccion.id, personaId, values)
          }
          submitLabel="Guardar"
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Icon className="size-4 text-muted-foreground" />
          {CANAL[interaccion.canal].label}
          <span className="text-xs font-normal text-muted-foreground">
            · {DIRECCION[interaccion.direccion]} ·{" "}
            {interaccion.fecha.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex gap-1">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => setEditing(true)}
            disabled={isPending}
          >
            Editar
          </Button>
          <Button
            size="xs"
            variant="ghost"
            onClick={handleEliminar}
            disabled={isPending}
          >
            Eliminar
          </Button>
        </div>
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm">{interaccion.resumen}</p>
      {interaccion.resultado && (
        <p className="mt-1 text-xs text-muted-foreground">
          Resultado: {interaccion.resultado}
        </p>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        {interaccion.autor.nombre}
      </p>
    </div>
  );
}
