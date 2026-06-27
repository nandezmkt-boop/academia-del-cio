"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { EstadoRelacion } from "@prisma/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cambiarEstadoPersona } from "../actions";
import { ESTADO_RELACION, ESTADOS_RELACION } from "../constants";

export function EstadoSelect({
  personaId,
  estado,
  triggerClassName = "w-52",
}: {
  personaId: string;
  estado: EstadoRelacion;
  triggerClassName?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(value: EstadoRelacion) {
    if (value === estado) return;
    startTransition(async () => {
      const res = await cambiarEstadoPersona(personaId, value);
      if (res.ok) {
        toast.success("Estado actualizado");
        router.refresh();
      } else {
        toast.error("No se pudo actualizar el estado");
      }
    });
  }

  return (
    <Select
      value={estado}
      onValueChange={(value) => handleChange(value as EstadoRelacion)}
      disabled={isPending}
    >
      <SelectTrigger size="sm" className={triggerClassName}>
        <SelectValue placeholder="Estado">
          {(value) =>
            ESTADO_RELACION[value as EstadoRelacion]?.label ?? "Estado"
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {ESTADOS_RELACION.map((e) => (
          <SelectItem key={e} value={e}>
            {ESTADO_RELACION[e].label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
