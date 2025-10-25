import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    novaSenha: z
      .string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .max(100, "A senha deve ter no máximo 100 caracteres"),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

export const changePasswordSchema = z
  .object({
    senhaAtual: z.string().min(1, "Senha atual é obrigatória"),
    novaSenha: z
      .string()
      .min(6, "A nova senha deve ter no mínimo 6 caracteres")
      .max(100, "A nova senha deve ter no máximo 100 caracteres"),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  })
  .refine((data) => data.senhaAtual !== data.novaSenha, {
    message: "A nova senha deve ser diferente da senha atual",
    path: ["novaSenha"],
  });
