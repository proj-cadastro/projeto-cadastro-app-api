import { z } from "zod";

export const createPontoSchema = z.object({
  entrada: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Entrada deve ser uma data válida",
    })
    .transform((date) => new Date(date)),
  saida: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Saída deve ser uma data válida",
    })
    .transform((date) => new Date(date))
    .optional(),
});

export const updatePontoSchema = z.object({
  saida: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Saída deve ser uma data válida",
    })
    .transform((date) => new Date(date)),
});

export const registrarEntradaSchema = z.object({
  usuarioId: z.string().uuid("Usuario ID deve ser um UUID válido"),
});

export const registrarSaidaSchema = z.object({
  pontoId: z.string().uuid("Ponto ID deve ser um UUID válido"),
});

export const pontoIdSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

export const usuarioIdSchema = z.object({
  usuarioId: z.string().uuid("Usuario ID deve ser um UUID válido"),
});

export const pontoQuerySchema = z.object({
  usuarioId: z.string().uuid().optional(),
  dataInicio: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Data início deve ser uma data válida",
    })
    .transform((date) => new Date(date))
    .optional(),
  dataFim: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Data fim deve ser uma data válida",
    })
    .transform((date) => new Date(date))
    .optional(),
});
