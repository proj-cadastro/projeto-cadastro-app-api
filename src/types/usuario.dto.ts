export interface CreateUsuarioDto {
  nome: string;
  email: string;
  senha: string;
  role?: "SUPER_ADMIN" | "ADMIN" | "MONITOR";
  isActive?: boolean;
  monitorId?: string;
}

export interface UpdateUsuarioDto {
  nome?: string;
  email?: string;
  senha?: string;
  role?: "SUPER_ADMIN" | "ADMIN" | "MONITOR";
  isActive?: boolean;
  monitorId?: string;
}

export interface LoginDto {
  email: string;
  senha: string;
}

export interface UsuarioResponse {
  id: string;
  nome: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MONITOR";
  isActive: boolean;
  monitor?: {
    id: string;
    nome: string;
    tipo: string;
    cargaHorariaSemanal: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
