import { Request, Response } from "express";
import * as cursoService from "./curso.service";
import * as professorService from "../professor/professor.service";
import * as materiaService from "../materia/materia.service";

export async function create(req: Request, res: Response) {
  try {
    const { materias, ...cursoData } = req.body;

    const coordenadorId = cursoData.coordenadorId;

    const existe = await professorService.isProfessorExists(coordenadorId);

    if (!existe)
      return res
        .status(400)
        .json({ sucesso: false, mensagem: "Coordenador informado não existe" });

    const jaCoordenador = await professorService.isProfessorCoordenador(
      coordenadorId
    );

    if (jaCoordenador)
      return res
        .status(400)
        .json({
          sucesso: false,
          mensagem: "Professor já é coordenador de outro curso",
        });

    const curso = await cursoService.createCurso(cursoData);

    if (materias && Array.isArray(materias)) {
      for (const materia of materias) {
        const materiaCriada = await materiaService.createMateria({
          ...materia,
          cursos: [{ cursoId: curso.id }],
        });
      }
    }

    return res
      .status(201)
      .json({
        sucesso: true,
        mensagem: "Curso e matérias criados com sucesso",
        data: curso,
      });
  } catch (error) {
    return res
      .status(400)
      .json({
        sucesso: false,
        mensagem: "Erro ao criar curso",
        erro: (error as Error).message,
      });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const cursos = await cursoService.getAllCursos();
    if (!cursos || cursos.length === 0)
      return res.status(404).json({
        sucesso: false,
        mensagem: "Nenhum curso encontrado",
        data: [],
      });
    return res.status(200).json({
      sucesso: true,
      mensagem: "Cursos encontrados com sucesso",
      data: cursos,
    });
  } catch (error) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Erro ao buscar cursos",
      erro: (error as Error).message,
    });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const curso = await cursoService.getCursoById(id);
    if (!curso)
      return res
        .status(404)
        .json({ sucesso: false, mensagem: "Curso não encontrado" });
    return res.status(200).json({ data: curso });
  } catch (error) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Erro ao buscar curso",
      erro: (error as Error).message,
    });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const coordenadorId = req.body.coordenadorId;

    const existe = await professorService.isProfessorExists(coordenadorId);
    if (!existe)
      return res
        .status(400)
        .json({ sucesso: false, mensagem: "Coordenador informado não existe" });

    const cursoBuscado = await cursoService.getCursoById(id);
    if (!cursoBuscado)
      return res
        .status(404)
        .json({ sucesso: false, mensagem: "Curso não encontrado" });

    const curso = await cursoService.updateCurso(id, req.body);
    return res.status(200).json({
      sucesso: true,
      mensagem: "Curso atualizado com sucesso",
      data: curso,
    });
  } catch (error) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Erro ao atualizar curso",
      erro: (error as Error).message,
    });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const curso = await cursoService.getCursoById(id);

    if (!curso)
      return res.status(404).json({ mensagem: "Curso não encontrado" });

    if (!curso)
      return res
        .status(404)
        .json({ sucesso: false, mensagem: "Curso não encontrado" });

    const materias = curso.materias?.map((cm: any) => cm.materia) || [];

    for (const materia of materias) {
      const unica = await materiaService.isMateriaUnicaEmCurso(materia.id);
      if (unica) {
        await materiaService.deleteMateria(materia.id);
      }
    }

    await cursoService.deleteCurso(id);
    return res
      .status(204)
      .json({ sucesso: true, mensagem: "Curso deletado com sucesso" });
  } catch (error) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Erro ao deletar curso",
      erro: (error as Error).message,
    });
  }
}

export async function hasMateriasExclusivas(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const curso = await cursoService.getCursoById(id);
    if (!curso)
      return res
        .status(404)
        .json({ sucesso: false, mensagem: "Curso não encontrado" });

    const materias = curso.materias?.map((cm: any) => cm.materia) || [];
    let quantidade = 0;

    for (const materia of materias) {
      const unica = await materiaService.isMateriaUnicaEmCurso(materia.id);
      if (unica) quantidade++;
    }

    return res.json({ temExclusivas: quantidade > 0, quantidade });
  } catch (error) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Erro ao verificar matérias exclusivas",
      erro: (error as Error).message,
    });
  }
}
