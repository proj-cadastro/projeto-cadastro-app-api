import { transporter } from "./nodemailer";

/**
 * Gera uma senha aleatória com pelo menos:
 * - 1 letra maiúscula
 * - 1 letra minúscula
 * - 1 número
 * - 1 caractere especial
 * - Mínimo 6 caracteres
 * @param length - Tamanho da senha (padrão: 8, mínimo: 6)
 * @returns Senha gerada
 */
export function generateRandomPassword(length: number = 8): string {
  // Garantir tamanho mínimo de 6 caracteres
  const finalLength = Math.max(length, 6);

  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = '!@#$%^&*(),.?":{}|<>';

  // Garantir que a senha tenha pelo menos um de cada tipo obrigatório
  let password = "";
  password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]; // 1 maiúscula
  password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]; // 1 minúscula
  password += numberChars[Math.floor(Math.random() * numberChars.length)]; // 1 número
  password += specialChars[Math.floor(Math.random() * specialChars.length)]; // 1 especial

  // Preencher o resto da senha com caracteres aleatórios
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  for (let i = password.length; i < finalLength; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Embaralhar a senha para que os caracteres obrigatórios não fiquem sempre no início
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

/**
 * Envia email com as credenciais de acesso para o monitor
 * @param email - Email do monitor
 * @param nome - Nome do monitor
 * @param senha - Senha gerada
 */
export async function sendMonitorCredentials(
  email: string,
  nome: string,
  senha: string
): Promise<void> {
  await transporter.sendMail({
    from: '"Equipe Pedreiros do TI" <email@gmail.com>',
    to: email,
    subject:
      "🎓 Bem-vindo ao Sistema de Monitoria - Suas credenciais de acesso",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 24px; background-color: #f9f9f9;">
        <h2 style="color: #2c3e50;">Olá, ${nome}!</h2>
        <p style="font-size: 16px; color: #333;">
          Seja bem-vindo(a) ao sistema de <strong>Monitoria</strong>! Seu cadastro foi realizado com sucesso.
        </p>
        <p style="font-size: 16px; color: #333;">
          Suas credenciais de acesso são:
        </p>
        
        <div style="background-color: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 20px; margin: 20px 0;">
          <p style="margin: 8px 0; font-size: 16px;">
            <strong>Email:</strong> ${email}
          </p>
          <p style="margin: 8px 0; font-size: 16px;">
            <strong>Senha:</strong> 
            <span style="font-family: 'Courier New', monospace; background-color: #f4f4f4; padding: 4px 8px; border-radius: 4px; font-size: 18px; font-weight: bold; color: #d63384;">
              ${senha}
            </span>
          </p>
        </div>
        
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #856404;">
            <strong>⚠️ Importante:</strong> Por questões de segurança, recomendamos que você altere sua senha no primeiro acesso ao sistema.
          </p>
        </div>
        
        <p style="font-size: 14px; color: #666;">
          Agora você pode acessar o sistema e começar a registrar seus pontos de trabalho.
        </p>
        
        <hr style="margin: 24px 0;" />
        <p style="font-size: 12px; color: #aaa; text-align: center;">
          © 2025 Pedreiros do TI. Todos os direitos reservados.
        </p>
      </div>
    `,
  });
}
