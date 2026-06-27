import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInteraccionesByPersona } from "../queries";
import { crearInteraccion } from "../actions";
import { InteraccionForm } from "./interaccion-form";
import { InteraccionItem } from "./interaccion-item";

/** Sección del hub (detalle de Persona): alta en línea + timeline append-only. */
export async function InteraccionTimeline({
  personaId,
}: {
  personaId: string;
}) {
  const interacciones = await getInteraccionesByPersona(personaId);
  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interacciones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border bg-muted/20 p-3">
          <p className="mb-3 text-sm font-medium">Nueva interacción</p>
          <InteraccionForm
            defaultValues={{
              canal: "EMAIL",
              direccion: "SALIENTE",
              fecha: hoy,
              resumen: "",
              resultado: "",
            }}
            onSubmit={crearInteraccion.bind(null, personaId)}
            submitLabel="Añadir"
          />
        </div>

        <div className="space-y-3">
          {interacciones.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no hay interacciones registradas.
            </p>
          ) : (
            interacciones.map((interaccion) => (
              <InteraccionItem
                key={interaccion.id}
                interaccion={interaccion}
                personaId={personaId}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
