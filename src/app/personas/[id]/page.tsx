import Link from "next/link";
import { notFound } from "next/navigation";

import { getPersonaById } from "@/features/personas/queries";
import { PersonaHeader } from "@/features/personas/components/persona-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

function formatFecha(fecha: Date | null) {
  if (!fecha) return "—";
  return fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function Campo({
  etiqueta,
  children,
}: {
  etiqueta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2">
      <dt className="text-sm text-muted-foreground">{etiqueta}</dt>
      <dd className="col-span-2 text-sm">{children}</dd>
    </div>
  );
}

export default async function PersonaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const persona = await getPersonaById(id);
  if (!persona) notFound();

  return (
    <div className="space-y-6">
      <Link
        className={buttonVariants({ variant: "link" }) + " px-0"}
        href="/personas"
      >
        ← Volver a personas
      </Link>

      <PersonaHeader persona={persona} />

      <Card>
        <CardHeader>
          <CardTitle>Información</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <Campo etiqueta="Email">
              {persona.email ? (
                <a className="underline" href={`mailto:${persona.email}`}>
                  {persona.email}
                </a>
              ) : (
                "—"
              )}
            </Campo>
            <Campo etiqueta="LinkedIn">
              {persona.linkedinUrl ? (
                <a
                  className="underline"
                  href={persona.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {persona.linkedinUrl}
                </a>
              ) : (
                "—"
              )}
            </Campo>
            <Campo etiqueta="Próxima acción">
              {persona.proximaAccion ?? "—"}
            </Campo>
            <Campo etiqueta="Fecha de seguimiento">
              {formatFecha(persona.fechaSeguimiento)}
            </Campo>
            <Campo etiqueta="Temas">
              {persona.temas.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {persona.temas.map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                </div>
              ) : (
                "—"
              )}
            </Campo>
            <Campo etiqueta="Dossier">
              {persona.dossier ? (
                <p className="whitespace-pre-wrap">{persona.dossier}</p>
              ) : (
                "—"
              )}
            </Campo>
            <Campo etiqueta="Creada">{formatFecha(persona.createdAt)}</Campo>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
