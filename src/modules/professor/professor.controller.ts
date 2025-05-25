import { Request, Response } from 'express';
import * as professorService from './professor.service';

export async function create(req: Request, res: Response) {
  try {
    const professor = await professorService.createProfessor(req.body);
    return res.status(201).json({ mensagem: "Professor criado com sucesso", data: professor });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro ao criar professor", erro: (error as Error).message });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const professores = await professorService.getAllProfessores();
    if (!professores || professores.length === 0) 
      return res.status(404).json({ mensagem: 'Nenhum professor encontrado' });
    return res.status(200).json({ mensagem: "Professores encontrados com sucesso", data: professores });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro ao buscar professores", erro: (error as Error).message });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const professor = await professorService.getProfessorById(id);
    if (!professor) return res.status(404).json({ mensagem: 'Professor não encontrado' });
    return res.status(200).json({ mensagem: "Professor encontrado com sucesso", data: professor });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro ao buscar professor", erro: (error as Error).message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const professor = await professorService.updateProfessor(id, req.body);
    return res.status(200).json({ mensagem: "Professor atualizado com sucesso", data: professor });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro ao atualizar professor", erro: (error as Error).message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await professorService.deleteProfessor(id);
    return res.status(204).json({ mensagem: "Professor deletado com sucesso" });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro ao deletar professor", erro: (error as Error).message });
  }
}
