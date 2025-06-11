export interface AuthResponseDto {
  token: string;
}

export interface ResetCodePayload {
  id: number,
  code: string,
  iat: number,
  exp: number
}