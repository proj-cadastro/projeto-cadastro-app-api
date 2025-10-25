import { Request, Response } from "express";
import * as materiaService from "./materia.service";
import * as professorService from "../professor/professor.service";
import * as cursoService from "../curso/curso.service";

export async function create(req: Request, res: Response) {
  try {
    const cursos = req.body.cursos;

    if (!cursos || !Array.isArray(cursos))
      return res
        .status(400)
        .json({ sucesso: false, mensagem: "Cursos devem ser um array" });

    if (!cursos || cursos.length === 0)
      return res
        .status(400)
        .json({
          sucesso: false,
          mensagem: "A matéria deve estar vinculada a pelo menos um curso",
        });

    const existe = await professorService.isProfessorExists(
      String(req.body.professorId)
    );
    if (!existe)
      return res
        .status(400)
        .json({ sucesso: false, mensagem: "Professor informado não existe" });

    const cursoIds = cursos.map((c: any) => String(c.cursoId));
    const cursosValidos = await cursoService.areCursosExist(cursoIds);

    if (!cursosValidos)
      return res
        .status(400)
        .json({ sucesso: false, mensagem: "Um ou mais cursos são inválidos" });

    const materia = await materiaService.createMateria(req.body);
    return res
      .status(201)
      .json({
        sucesso: true,
        mensagem: "Matéria criada com sucesso",
        data: materia,
      });
  } catch (error) {
    return res
      .status(400)
      .json({
        sucesso: false,
        mensagem: "Erro ao criar matéria",
        erro: (error as Error).message,
      });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const materias = await materiaService.getAllMaterias();
    if (!materias || materias.length === 0)
      return res
        .status(404)
        .json({
          sucesso: false,
          mensagem: "Nenhuma matéria encontrada",
          data: [],
        });
    return res
      .status(200)
      .json({
        sucesso: true,
        mensagem: "Matérias encontradas com sucesso",
        data: materias,
      });
  } catch (error) {
    return res
      .status(400)
      .json({
        mensagem: "Erro ao buscar matérias",
        erro: (error as Error).message,
      });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const materia = await materiaService.getMateriaById(id);
    if (!materia)
      return res
        .status(404)
        .json({ sucesso: false, mensagem: "Matéria não encontrada" });
    return res.status(200).json({ data: materia });
  } catch (error) {
    return res
      .status(400)
      .json({
        sucesso: false,
        mensagem: "Erro ao buscar matéria",
        erro: (error as Error).message,
      });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = String(req.params.id);

    const { cursos } = req.body;

    const existingMateria = await materiaService.getMateriaById(id);
    if (!existingMateria)
      return res
        .status(404)
        .json({ sucesso: false, mensagem: "Matéria não encontrada" });

    if (cursos && cursos.length === 0)
      return res
        .status(400)
        .json({
          sucesso: false,
          mensagem: "A matéria deve estar vinculada a pelo menos um curso",
        });

    const materia = await materiaService.updateMateria(id, req.body);

    return res
      .status(200)
      .json({
        sucesso: true,
        mensagem: "Matéria atualizada com sucesso",
        data: materia,
      });
  } catch (error) {
    return res
      .status(400)
      .json({
        sucesso: false,
        mensagem: "Erro ao atualizar matéria",
        erro: (error as Error).message,
      });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = String(req.params.id);

    const materia = await materiaService.getMateriaById(id);
    if (!materia)
      return res.status(404).json({ mensagem: "Matéria não encontrada" });

    const existingMateria = await materiaService.getMateriaById(id);
    if (!existingMateria)
      return res
        .status(404)
        .json({ sucesso: false, mensagem: "Matéria não encontrada" });

    await materiaService.deleteMateria(id);

    return res
      .status(204)
      .json({ sucesso: true, mensagem: "Matéria deletada com sucesso" });
  } catch (error) {
    return res
      .status(400)
      .json({
        sucesso: false,
        mensagem: "Erro ao deletar matéria",
        erro: (error as Error).message,
      });
  }
}
