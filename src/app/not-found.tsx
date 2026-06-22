import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md space-y-4 py-16 text-center">
      <h2 className="text-xl font-semibold">Página no encontrada</h2>
      <p className="text-sm text-muted-foreground">
        La página que buscas no existe.
      </p>
      <Link className={buttonVariants()} href="/personas">
        Ir a Personas
      </Link>
    </div>
  );
}
