"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { archivarPersona } from "../actions";

export function ArchivarButton({ personaId }: { personaId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleArchivar() {
    const ok = window.confirm(
      "¿Archivar esta persona? Saldrá de la lista activa, pero no se borra y se puede recuperar."
    );
    if (!ok) return;

    startTransition(async () => {
      const res = await archivarPersona(personaId);
      if (res.ok) {
        toast.success("Persona archivada");
        router.push("/pipeline");
        router.refresh();
      } else {
        toast.error("No se pudo archivar");
      }
    });
  }

  return (
    <Button variant="outline" onClick={handleArchivar} disabled={isPending}>
      {isPending ? "Archivando…" : "Archivar"}
    </Button>
  );
}
