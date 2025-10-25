export interface CreateMateriaDto {
  nome: string;
  cargaHoraria: number;
  professorId?: string;

  cursos: {
    cursoId: string;
  }[];
}

export interface UpdateMateriaDto extends Partial<CreateMateriaDto> {}

export interface VincularMateriaCursoDto {
  cursoId: string;
  materiaId: string;
  semestre: number;
  turno: "MATUTINO" | "VESPERTINO" | "NOTURNO";
  tipo: "OBRIGATORIA" | "OPTATIVA";
}
