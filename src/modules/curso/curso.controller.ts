import { Request, Response } from 'express';
import * as cursoService from './curso.service';

export async function create(req: Request, res: Response) {
  try {
    const curso = await cursoService.createCurso(req.body);
    return res.status(201).json({ mensagem: "Curso criado com sucesso", data: curso });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro ao criar curso", erro: (error as Error).message });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const cursos = await cursoService.getAllCursos();
    if (!cursos || cursos.length === 0)
      return res.status(404).json({ mensagem: 'Nenhum curso encontrado' });
    return res.status(200).json({ mensagem: "Cursos encontrados com sucesso", data: cursos });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro ao buscar cursos", erro: (error as Error).message });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const curso = await cursoService.getCursoById(id);
    if (!curso) return res.status(404).json({ mensagem: 'Curso não encontrado' });
    return res.status(200).json({ data: curso });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro ao buscar curso", erro: (error as Error).message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const curso = await cursoService.getCursoById(id);
    if (!curso) return res.status(404).json({ mensagem: 'Curso não encontrado' });

    const cursoAtualizado = await cursoService.updateCurso(id, req.body);
    return res.status(200).json({ mensagem: "Curso atualizado com sucesso", data: cursoAtualizado });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro ao atualizar curso", erro: (error as Error).message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const curso = await cursoService.getCursoById(id);
    if (!curso) return res.status(404).json({ mensagem: 'Curso não encontrado' });
    
    await cursoService.deleteCurso(id);
    return res.status(204).json({ mensagem: "Curso deletado com sucesso" });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro ao deletar curso", erro: (error as Error).message });
  }
}
