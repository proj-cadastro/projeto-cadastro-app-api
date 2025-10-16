import { z } from "zod";

export const createMateriaSchema = z.object({
  nome: z.string().max(100, "Nome deve ter no máximo 100 caracteres"),
  cargaHoraria: z.number().int().min(20).max(120),

  professorId: z.string().uuid().optional(),

  cursos: z
    .array(
      z.object({
        cursoId: z.string().uuid("Curso ID deve ser um UUID válido"),
      })
    )
    .min(1, "A matéria deve estar vinculada a pelo menos um curso"),
});

export const updateMateriaSchema = createMateriaSchema.partial();

export type CreateMateriaDto = z.infer<typeof createMateriaSchema>;
export type UpdateMateriaDto = z.infer<typeof updateMateriaSchema>;
