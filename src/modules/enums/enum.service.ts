import { modeloCurso, statusAtividade, referencias, tipoMateria, titulacoes, turnos } from './enum.model'

export async function getTitulacao() {
  return titulacoes;
}

export async function getStatusAtividade() {
  return statusAtividade;
}

export async function getModeloCurso() {
  return modeloCurso;
}

export async function getReferencia() {
  return referencias;
}

export async function getTurno() {
  return turnos;
}

export async function getTipoMateria() {
  return tipoMateria;
}
