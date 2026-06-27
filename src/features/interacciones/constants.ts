import type { CanalInteraccion, DireccionInteraccion } from "@prisma/client";
import {
  Mail,
  Contact,
  Phone,
  Users,
  StickyNote,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

export const CANAL: Record<CanalInteraccion, { label: string; icon: LucideIcon }> =
  {
    EMAIL: { label: "Email", icon: Mail },
    LINKEDIN: { label: "LinkedIn", icon: Contact },
    LLAMADA: { label: "Llamada", icon: Phone },
    REUNION: { label: "Reunión", icon: Users },
    NOTA: { label: "Nota interna", icon: StickyNote },
    OTRO: { label: "Otro", icon: MessageSquare },
  };

export const CANALES = Object.keys(CANAL) as CanalInteraccion[];

export const DIRECCION: Record<DireccionInteraccion, string> = {
  ENTRANTE: "Entrante",
  SALIENTE: "Saliente",
  INTERNA: "Interna",
};

export const DIRECCIONES = Object.keys(DIRECCION) as DireccionInteraccion[];
