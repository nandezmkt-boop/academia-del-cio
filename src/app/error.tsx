"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log en cliente; en servidor Next ya registra el error con su digest.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md space-y-4 py-16 text-center">
      <h2 className="text-xl font-semibold">Algo ha ido mal</h2>
      <p className="text-sm text-muted-foreground">
        Ha ocurrido un error inesperado. Puedes reintentar.
      </p>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  );
}
