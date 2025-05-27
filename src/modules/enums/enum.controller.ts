import { Request, Response } from "express";
import * as enumService from "./enum.service";

export async function getTitulacao(req: Request, res: Response) {
  try {
    const titulacoes = await enumService.getTitulacao();
    return res.status(200).json({ mensagem: "Titulações encontradas com sucesso", data: titulacoes });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro ao buscar titulações", erro: (error as Error).message });
  }
}

export async function getStatusAtividade(req: Request, res: Response) {
  try {
    const statusAtividades = await enumService.getStatusAtividade();
    return res.status(200).json({ mensagem: "Status de Atividades encontrados com sucesso", data: statusAtividades });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro ao buscar Status de Atividades", erro: (error as Error).message });
  }
}

export async function getModeloCurso(req: Request, res: Response) {
  try {
    const modelosCurso = await enumService.getModeloCurso();
    return res.status(200).json({ mensagem: "Modelos de Curso encontrados com sucesso", data: modelosCurso });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro ao buscar Modelos de Curso", erro: (error as Error).message });
  }
}

export async function getReferencia(req: Request, res: Response) {
  try {
    const referencias = await enumService.getReferencia();
    return res.status(200).json({ mensagem: "Referências encontradas com sucesso", data: referencias });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro ao buscar Referências", erro: (error as Error).message });
  }
}

export async function getTurno(req: Request, res: Response) {
  try {
    const turnos = await enumService.getTurno();
    return res.status(200).json({ mensagem: "Turnos encontrados com sucesso", data: turnos });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro ao buscar Turnos", erro: (error as Error).message });
  }
}

export async function getTipoMateria(req: Request, res: Response) {
  try {
    const tiposMateria = await enumService.getTipoMateria();
    return res.status(200).json({ mensagem: "Tipos de Matéria encontrados com sucesso", data: tiposMateria });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro ao buscar Tipos de Matéria", erro: (error as Error).message });
  }
}