import { ModeloCurso } from '@prisma/client';

export interface CreateCursoDto {
  nome: string;
  codigo: string;
  sigla: string;
  modelo: ModeloCurso;
  coordenadorId: number;
}

export interface UpdateCursoDto extends Partial<CreateCursoDto> {}

