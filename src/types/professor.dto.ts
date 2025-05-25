import { Titulacao, StatusAtividade, Referencia } from '@prisma/client';

export interface CreateProfessorDto {
  nome: string;
  email: string;
  titulacao: Titulacao;
  idUnidade: string;
  referencia: Referencia;
  lattes: string;
  statusAtividade: StatusAtividade;
  observacoes?: string;
}

export interface UpdateProfessorDto extends Partial<CreateProfessorDto> {}
