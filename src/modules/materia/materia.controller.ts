import { Request, Response } from 'express';
import * as materiaService from './materia.service';

export async function create(req: Request, res: Response) {
  try {
    const materia = await materiaService.createMateria(req.body);
    return res.status(201).json({ mensagem: "Matéria criada com sucesso", data: materia });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro ao criar matéria", erro: (error as Error).message });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const materias = await materiaService.getAllMaterias();
    if (!materias || materias.length === 0) 
      return res.status(404).json({ mensagem: 'Nenhuma matéria encontrada' });
    return res.status(200).json({ mensagem: "Matérias encontradas com sucesso", data: materias });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro ao buscar matérias", erro: (error as Error).message });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const materia = await materiaService.getMateriaById(id);
    if (!materia) return res.status(404).json({ mensagem: 'Matéria não encontrada' });
    return res.status(200).json({ data: materia });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro ao buscar matéria", erro: (error as Error).message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const materia = await materiaService.getMateriaById(id);
    if (!materia) return res.status(404).json({ mensagem: 'Matéria não encontrada' });

    const materiaAtualizada = await materiaService.updateMateria(id, req.body);
    return res.status(200).json({ mensagem: "Matéria atualizada com sucesso", data: materiaAtualizada });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro ao atualizar matéria", erro: (error as Error).message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const materia = await materiaService.getMateriaById(id);
    if (!materia) return res.status(404).json({ mensagem: 'Matéria não encontrada' });

    await materiaService.deleteMateria(id);
    return res.status(204).json({ mensagem: "Matéria deletada com sucesso" });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro ao deletar matéria", erro: (error as Error).message });
  }
}
