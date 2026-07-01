import Link from "next/link";
import { notFound } from "next/navigation";

import { getPersonaById } from "@/features/personas/queries";
import { actualizarPersona } from "@/features/personas/actions";
import { PersonaForm } from "@/features/personas/components/persona-form";
import type { PersonaInput } from "@/features/personas/schema";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function EditarPersonaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const persona = await getPersonaById(id);
  if (!persona) notFound();

  const defaultValues: PersonaInput = {
    nombre: persona.nombre,
    email: persona.email ?? "",
    empresaActual: persona.empresaActual ?? "",
    cargoActual: persona.cargoActual ?? "",
    linkedinUrl: persona.linkedinUrl ?? "",
    proximaAccion: persona.proximaAccion ?? "",
    fechaSeguimiento: persona.fechaSeguimiento
      ? persona.fechaSeguimiento.toISOString().slice(0, 10)
      : "",
    fechaLlamada: persona.fechaLlamada
      ? persona.fechaLlamada.toISOString().slice(0, 10)
      : "",
    fechaEntrevista: persona.fechaEntrevista
      ? persona.fechaEntrevista.toISOString().slice(0, 10)
      : "",
    fechaPublicacionPrevista: persona.fechaPublicacionPrevista
      ? persona.fechaPublicacionPrevista.toISOString().slice(0, 10)
      : "",
    dossier: persona.dossier ?? "",
  };

  return (
    <div className="space-y-6">
      <Link
        className={buttonVariants({ variant: "link" }) + " px-0"}
        href={`/personas/${persona.id}`}
      >
        ← Volver al detalle
      </Link>
      <h1 className="text-2xl font-semibold">Editar persona</h1>
      <PersonaForm
        defaultValues={defaultValues}
        onSubmit={actualizarPersona.bind(null, persona.id)}
        submitLabel="Guardar cambios"
        redirectTo={`/personas/${persona.id}`}
      />
    </div>
  );
}
