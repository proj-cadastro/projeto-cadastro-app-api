export interface CreatePontoDto {
  entrada: Date;
  saida?: Date;
}

export interface UpdatePontoDto {
  saida: Date;
}

export interface PontoResponse {
  id: string;
  entrada: Date;
  saida?: Date;
  usuario: {
    id: string;
    nome: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface RegistrarEntradaDto {
  usuarioId: string;
}

export interface RegistrarSaidaDto {
  pontoId: string;
}
