import { z } from "zod";

export const DiaSemanaEnum = z.enum([
  "SEGUNDA",
  "TERCA",
  "QUARTA",
  "QUINTA",
  "SEXTA",
  "SABADO",
  "DOMINGO",
]);

export const TipoMonitorEnum = z.enum(["MONITOR", "PESQUISADOR"]);

export const createHorarioTrabalhoSchema = z.object({
  diaSemana: DiaSemanaEnum,
  horasTrabalho: z.number().min(1).max(8, "Máximo de 8 horas por dia"),
});

const baseMonitorSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  cargaHorariaSemanal: z
    .number()
    .min(1)
    .max(40, "Carga horária semanal deve ser entre 1 e 40 horas"),
  tipo: TipoMonitorEnum,
  nomePesquisaMonitoria: z
    .string()
    .min(5, "Nome da pesquisa/monitoria deve ter pelo menos 5 caracteres"),
  professorId: z.string().uuid("Professor ID deve ser um UUID válido"),
  horarios: z
    .array(createHorarioTrabalhoSchema)
    .min(1, "Deve ter pelo menos um horário de trabalho"),
});

export const createMonitorSchema = baseMonitorSchema.superRefine(
  (data, ctx) => {
    const totalHoras = data.horarios.reduce(
      (sum, h) => sum + h.horasTrabalho,
      0
    );
    if (totalHoras !== data.cargaHorariaSemanal) {
      ctx.addIssue({
        path: ["horarios"],
        code: z.ZodIssueCode.custom,
        message:
          "Total de horas dos horários deve corresponder à carga horária semanal",
      });
    }
  }
);

export const updateMonitorSchema = baseMonitorSchema.partial();
export const monitorIdSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});
