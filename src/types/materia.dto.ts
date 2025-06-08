export interface CreateMateriaDto {
  nome: string;
  cargaHoraria: number;
  professorId?: number;

  cursos: {
    cursoId: number;
  }[];
}

export interface UpdateMateriaDto extends Partial<CreateMateriaDto> {}

export interface VincularMateriaCursoDto {
  cursoId: number;
  materiaId: number;
  semestre: number;
  turno: 'MATUTINO' | 'VESPERTINO' | 'NOTURNO';
  tipo: 'OBRIGATORIA' | 'OPTATIVA';
}
