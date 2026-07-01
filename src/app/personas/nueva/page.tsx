import Link from "next/link";

import { PersonaForm } from "@/features/personas/components/persona-form";
import { crearPersona } from "@/features/personas/actions";
import type { PersonaInput } from "@/features/personas/schema";
import { buttonVariants } from "@/components/ui/button";

const VALORES_INICIALES: PersonaInput = {
  nombre: "",
  email: "",
  empresaActual: "",
  cargoActual: "",
  linkedinUrl: "",
  proximaAccion: "",
  fechaSeguimiento: "",
  fechaLlamada: "",
  fechaEntrevista: "",
  fechaPublicacionPrevista: "",
  dossier: "",
};

export default function NuevaPersonaPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          className={buttonVariants({ variant: "link" }) + " px-0"}
          href="/pipeline"
        >
          ← Volver al pipeline
        </Link>
        <h1 className="text-2xl font-semibold">Nueva persona</h1>
        <p className="text-sm text-muted-foreground">
          Solo el nombre es obligatorio. El resto se puede completar después.
        </p>
      </div>
      <PersonaForm
        defaultValues={VALORES_INICIALES}
        onSubmit={crearPersona}
        submitLabel="Crear persona"
        redirectTo="/pipeline"
      />
    </div>
  );
}
