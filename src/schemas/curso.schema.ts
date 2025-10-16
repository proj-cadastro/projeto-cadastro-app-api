import { z } from "zod";

export const createCursoSchema = z.object({
  nome: z.string().max(100, "Nome deve ter no máximo 100 caracteres"),

  codigo: z
    .string()
    .regex(/^\d{1,4}$/, "Código deve conter até 4 algarismos numéricos"),

  sigla: z
    .string()
    .min(1, "Sigla deve ter no mínimo 1 caractere")
    .max(4, "Sigla deve ter no máximo 4 caracteres")
    .regex(/^[A-Za-z]+$/, "Sigla deve conter apenas letras"),

  modelo: z.enum(["PRESENCIAL", "HIBRIDO", "EAD"], {
    errorMap: () => ({ message: "Modelo inválido" }),
  }),

  coordenadorId: z.string().uuid("CoordenadorId deve ser um UUID válido"),

  materias: z
    .array(
      z.object({
        nome: z
          .string()
          .max(100, "Nome da matéria deve ter no máximo 100 caracteres"),
        cargaHoraria: z
          .number()
          .int("Carga horária deve ser um número inteiro"),
        professorId: z.string().uuid("ProfessorId deve ser um UUID válido"),
      })
    )
    .optional(),
});

export const updateCursoSchema = createCursoSchema.partial();

export type CreateCursoDto = z.infer<typeof createCursoSchema>;
export type UpdateCursoDto = z.infer<typeof updateCursoSchema>;
