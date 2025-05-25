import { z } from 'zod';

export const createCursoSchema = z.object({
  nome: z.string()
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  codigo: z.string()
    .regex(/^\d{1,4}$/, 'Código deve conter até 4 algarismos numéricos'),

  sigla: z.string()
    .min(1, 'Sigla deve ter no mínimo 1 caractere')
    .max(4, 'Sigla deve ter no máximo 4 caracteres')
    .regex(/^[A-Za-z]+$/, 'Sigla deve conter apenas letras')
    .optional(),

  modelo: z.enum(['PRESENCIAL', 'HIBRIDO', 'EAD'], {
    errorMap: () => ({ message: 'Modelo inválido' })
  }).optional(),

  coordenadorId: z.number()
    .int('CoordenadorId deve ser um número inteiro')
});

export const updateCursoSchema = createCursoSchema.partial();

export type CreateCursoDto = z.infer<typeof createCursoSchema>;
export type UpdateCursoDto = z.infer<typeof updateCursoSchema>;
