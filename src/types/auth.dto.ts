export interface AuthResponseDto {
  token: string;
}

export interface ResetCodePayload {
  userId: string;
  code: string;
  iat: number;
  exp: number;
}

export interface ResetPasswordDto {
  novaSenha: string;
  confirmarSenha: string;
}

export interface ChangePasswordDto {
  senhaAtual: string;
  novaSenha: string;
  confirmarSenha: string;
}
