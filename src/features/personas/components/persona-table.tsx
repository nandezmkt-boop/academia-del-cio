import Link from "next/link";
import type { Persona } from "@prisma/client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ESTADO_RELACION } from "../constants";

export function PersonaTable({ personas }: { personas: Persona[] }) {
  if (personas.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
        Aún no hay personas. Crea la primera con el botón “Nueva persona”.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Empresa</TableHead>
          <TableHead>Cargo</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {personas.map((persona) => (
          <TableRow key={persona.id}>
            <TableCell className="font-medium">
              <Link className="hover:underline" href={`/personas/${persona.id}`}>
                {persona.nombre}
              </Link>
            </TableCell>
            <TableCell>{persona.empresaActual ?? "—"}</TableCell>
            <TableCell>{persona.cargoActual ?? "—"}</TableCell>
            <TableCell>
              <Badge variant="secondary">
                {ESTADO_RELACION[persona.estadoRelacion].label}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
