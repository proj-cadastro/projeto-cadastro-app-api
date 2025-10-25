export interface CreateMonitorDto {
  nome: string;
  email: string;
  cargaHorariaSemanal: number;
  tipo: "MONITOR" | "PESQUISADOR";
  nomePesquisaMonitoria: string;
  professorId: string;
  horarios: CreateHorarioTrabalhoDto[];
}

export interface UpdateMonitorDto {
  nome?: string;
  email?: string;
  cargaHorariaSemanal?: number;
  tipo?: "MONITOR" | "PESQUISADOR";
  nomePesquisaMonitoria?: string;
  professorId?: string;
  horarios?: CreateHorarioTrabalhoDto[];
}

export interface CreateHorarioTrabalhoDto {
  diaSemana:
    | "SEGUNDA"
    | "TERCA"
    | "QUARTA"
    | "QUINTA"
    | "SEXTA"
    | "SABADO"
    | "DOMINGO";
  horasTrabalho: number;
}

export interface MonitorResponse {
  id: string;
  nome: string;
  email: string;
  cargaHorariaSemanal: number;
  tipo: "MONITOR" | "PESQUISADOR";
  nomePesquisaMonitoria: string;
  professor: {
    id: string;
    nome: string;
    email: string;
  };
  horarios: {
    diaSemana: string;
    horasTrabalho: number;
  }[];
  usuario?: {
    id: string;
    nome: string;
    email: string;
    isActive: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
