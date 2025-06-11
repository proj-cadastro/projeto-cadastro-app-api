import { transporter } from "./nodemailer"

export async function generateResetCode(): Promise<string> {
    //código de 6 caractéres
    const code = Math.floor(100000 + Math.random() * 900000)
    return code.toString()
}

export async function sendResetCode(email: string, code: string) {
    await transporter.sendMail({
        from: '"Equipe Pedreiros do TI" <email@gmail.com>',
        to: email,
        subject: '🔒 Código de Recuperação de Senha - Cadastro de Professores',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 24px; background-color: #f9f9f9;">
        <h2 style="color: #2c3e50;">Olá,</h2>
        <p style="font-size: 16px; color: #333;">
          Recebemos uma solicitação para redefinir sua senha no sistema <strong>Cadastro de Professores</strong>.
        </p>
        <p style="font-size: 16px; color: #333;">
          Utilize o código abaixo para continuar com a recuperação da sua conta:
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #2c3e50; letter-spacing: 4px;">${code}</span>
        </div>
        <p style="font-size: 14px; color: #666;">
          Caso você não tenha solicitado a recuperação de senha, apenas ignore este e-mail.
        </p>
        <hr style="margin: 24px 0;" />
        <p style="font-size: 12px; color: #aaa; text-align: center;">
          © 2025 Pedreiros do TI. Todos os direitos reservados.
        </p>
      </div>
    `
    });
}
