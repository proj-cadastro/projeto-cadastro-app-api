import { z } from 'zod';

export const createUsuarioSchema = z.object({
  nome: z.string()
    .max(50, 'Nome deve ter no máximo 50 caracteres'),

  email: z.string()
    .email('Email inválido'),

  senha: z.string()
    .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/, 'Senha deve conter pelo menos uma letra maiúscula e um caractere especial')
});

export const updateUsuarioSchema = createUsuarioSchema.partial();

export type CreateUsuarioDto = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioDto = z.infer<typeof updateUsuarioSchema>;
