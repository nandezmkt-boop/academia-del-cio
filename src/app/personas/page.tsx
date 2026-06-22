import Link from "next/link";

import { getPersonas } from "@/features/personas/queries";
import { PersonaTable } from "@/features/personas/components/persona-table";
import { buttonVariants } from "@/components/ui/button";

// Lista en vivo desde la BD: sin prerender estático en build.
export const dynamic = "force-dynamic";

export default async function PersonasPage() {
  const personas = await getPersonas();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Personas</h1>
          <p className="text-sm text-muted-foreground">
            Líderes en tu pipeline de relación.
          </p>
        </div>
        <Link className={buttonVariants()} href="/personas/nueva">
          Nueva persona
        </Link>
      </div>
      <PersonaTable personas={personas} />
    </div>
  );
}
