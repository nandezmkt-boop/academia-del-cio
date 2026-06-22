"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { crearPersona } from "../actions";
import { crearPersonaSchema, type CrearPersonaInput } from "../schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PersonaForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CrearPersonaInput>({
    resolver: zodResolver(crearPersonaSchema),
    defaultValues: {
      nombre: "",
      email: "",
      empresaActual: "",
      cargoActual: "",
      linkedinUrl: "",
      proximaAccion: "",
    },
  });

  function onSubmit(values: CrearPersonaInput) {
    startTransition(async () => {
      const res = await crearPersona(values);
      if (res.ok) {
        toast.success("Persona creada");
        router.push("/personas");
        router.refresh();
      } else {
        for (const [field, mensajes] of Object.entries(res.errors)) {
          form.setError(field as keyof CrearPersonaInput, {
            message: mensajes?.[0],
          });
        }
        toast.error("Revisa los campos del formulario");
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-xl space-y-4"
      >
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre *</FormLabel>
              <FormControl>
                <Input placeholder="Nombre y apellidos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="nombre@empresa.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="empresaActual"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Empresa actual</FormLabel>
              <FormControl>
                <Input placeholder="Empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cargoActual"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo actual</FormLabel>
              <FormControl>
                <Input placeholder="CIO, CTO, ..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linkedinUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="proximaAccion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Próxima acción</FormLabel>
              <FormControl>
                <Input placeholder="p. ej. Enviar primer mensaje" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Guardando…" : "Crear persona"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/personas")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
