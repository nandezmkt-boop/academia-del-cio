"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import type { ActionResult } from "../actions";
import { interaccionSchema, type InteraccionInput } from "../schema";
import { CANAL, CANALES, DIRECCION, DIRECCIONES } from "../constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type InteraccionFormProps = {
  defaultValues: InteraccionInput;
  onSubmit: (values: InteraccionInput) => Promise<ActionResult>;
  submitLabel: string;
  onCancel?: () => void;
};

export function InteraccionForm({
  defaultValues,
  onSubmit,
  submitLabel,
  onCancel,
}: InteraccionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<InteraccionInput>({
    resolver: zodResolver(interaccionSchema),
    defaultValues,
  });

  function handleSubmit(values: InteraccionInput) {
    startTransition(async () => {
      const res = await onSubmit(values);
      if (res.ok) {
        toast.success("Interacción guardada");
        router.refresh();
        // Alta: limpiar para registrar otra. Edición (onCancel): salir del modo edición.
        if (onCancel) onCancel();
        else form.reset(defaultValues);
      } else {
        for (const [field, mensajes] of Object.entries(res.errors)) {
          if (field in values) {
            form.setError(field as keyof InteraccionInput, {
              message: mensajes?.[0],
            });
          }
        }
        toast.error(res.errors._?.[0] ?? "Revisa los campos del formulario");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="canal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Canal</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(v) => field.onChange(v)}
                >
                  <SelectTrigger size="sm" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CANALES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {CANAL[c].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(v) => field.onChange(v)}
                >
                  <SelectTrigger size="sm" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIRECCIONES.map((d) => (
                      <SelectItem key={d} value={d}>
                        {DIRECCION[d]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fecha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="resumen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resumen *</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Qué se habló / acordó…"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="resultado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resultado</FormLabel>
              <FormControl>
                <Input placeholder="Desenlace o sentimiento (opcional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Guardando…" : submitLabel}
          </Button>
          {onCancel && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
