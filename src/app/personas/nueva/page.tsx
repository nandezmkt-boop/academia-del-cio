import Link from "next/link";

import { PersonaForm } from "@/features/personas/components/persona-form";
import { buttonVariants } from "@/components/ui/button";

export default function NuevaPersonaPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          className={buttonVariants({ variant: "link" }) + " px-0"}
          href="/personas"
        >
          ← Volver a personas
        </Link>
        <h1 className="text-2xl font-semibold">Nueva persona</h1>
        <p className="text-sm text-muted-foreground">
          Solo el nombre es obligatorio. El resto se puede completar después.
        </p>
      </div>
      <PersonaForm />
    </div>
  );
}
