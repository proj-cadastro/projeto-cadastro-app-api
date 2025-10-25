import { z } from "zod";

export const UserRoleEnum = z.enum(["SUPER_ADMIN", "ADMIN", "MONITOR"]);

export const createUsuarioSchema = z.object({
  nome: z.string().max(50, "Nome deve ter no máximo 50 caracteres"),

  email: z.string().email("Email inválido"),

  senha: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
      "Senha deve conter pelo menos uma letra maiúscula e um caractere especial"
    ),

  role: UserRoleEnum.default("ADMIN"),

  isActive: z.boolean().default(true),

  monitorId: z.string().uuid().optional(),
});

export const updateUsuarioSchema = createUsuarioSchema.partial();

export const usuarioIdSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

export type CreateUsuarioDto = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioDto = z.infer<typeof updateUsuarioSchema>;
