import { z } from 'zod';

export const createMateriaSchema = z.object({
  nome: z.string()
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  cargaHoraria: z.number()
    .int('Carga horária deve ser um número inteiro')
    .min(20, 'Carga horária mínima de 20 horas')
    .max(120, 'Carga horária máxima de 120 horas'),

  professorId: z.number()
    .int('ProfessorId deve ser um número inteiro')
});

export const updateMateriaSchema = createMateriaSchema.partial();

export type CreateMateriaDto = z.infer<typeof createMateriaSchema>;
export type UpdateMateriaDto = z.infer<typeof updateMateriaSchema>;
