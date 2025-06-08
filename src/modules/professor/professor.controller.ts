import { Request, Response } from 'express';
import * as professorService from './professor.service';
import * as cursoService from '../curso/curso.service';

export async function create(req: Request, res: Response) {
  try {
    const professor = await professorService.createProfessor(req.body);
    return res.status(201).json({ sucesso: true, mensagem: "Professor criado com sucesso", data: professor });
  } catch (error) {
    return res.status(400).json({ sucesso: false, mensagem: "Erro ao criar professor", erro: (error as Error).message });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const professores = await professorService.getAllProfessores();
    if (!professores || professores.length === 0) 
      return res.status(404).json({ sucesso: false, mensagem: 'Nenhum professor encontrado', data:[] });
    return res.status(200).json({ sucesso: true, mensagem: "Professores encontrados com sucesso", data: professores });
  } catch (error) {
    return res.status(400).json({ sucesso: false, mensagem: "Erro ao buscar professores", erro: (error as Error).message });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const professor = await professorService.getProfessorById(id);
    if (!professor) return res.status(404).json({ sucesso: false, mensagem: 'Professor não encontrado' });
    return res.status(200).json({ sucesso: true, mensagem: "Professor encontrado com sucesso", data: professor });
  } catch (error) {
    return res.status(400).json({ sucesso: false, mensagem: "Erro ao buscar professor", erro: (error as Error).message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const professor = await professorService.updateProfessor(id, req.body);
    return res.status(200).json({ sucesso: true, mensagem: "Professor atualizado com sucesso", data: professor });
  } catch (error) {
    return res.status(400).json({ sucesso: false, mensagem: "Erro ao atualizar professor", erro: (error as Error).message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const existingProfessor = await professorService.getProfessorById(id);
    if (!existingProfessor) return res.status(404).json({ sucesso: false, mensagem: 'Professor não encontrado' });

    const isCoordenador = await professorService.isProfessorCoordenador(id);
    if (isCoordenador) 
      return res.status(400).json({ sucesso: false, mensagem: 'Professor é coordenador de um curso e não pode ser deletado' });

    await professorService.deleteProfessor(id);
    return res.status(204).json({ sucesso: true, mensagem: "Professor deletado com sucesso" });
  } catch (error) {
    return res.status(400).json({ sucesso: false, mensagem: "Erro ao deletar professor", erro: (error as Error).message });
  }
}

export async function transferirCoordenacao(req: Request, res: Response) {
  try {
    const idAtual = Number(req.params.id);
    const novoCoordenadorId = Number(req.body.novoCoordenadorId);

    const existeAtual = await professorService.isProfessorExists(idAtual);
    const existeNovo = await professorService.isProfessorExists(novoCoordenadorId);

    if (!existeAtual || !existeNovo)
      return res.status(404).json({ sucesso: false, mensagem: 'Professor não encontrado' });

    const cursos = await cursoService.getCursosByCoordenadorId(idAtual);
    if (!cursos || cursos.length === 0)
      return res.status(404).json({ sucesso: false, mensagem: 'Professor não é coordenador de nenhum curso' });

    await Promise.all(
      cursos.map((curso: any) =>
        cursoService.updateCurso(curso.id, { coordenadorId: novoCoordenadorId })
      )
    );

    return res.status(200).json({ sucesso: true, mensagem: 'Coordenação transferida com sucesso' });
  } catch (error) {
    return res.status(400).json({ sucesso: false, mensagem: "Erro ao transferir coordenação", erro: (error as Error).message });
  }
}

export async function hasCursoCoordenado(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const isCoordenador = await professorService.isProfessorCoordenador(id);
    return res.json({ isCoordenador });
  } catch (error) {
    return res.status(400).json({ sucesso: false, mensagem: "Erro ao verificar coordenação", erro: (error as Error).message });
  }
}