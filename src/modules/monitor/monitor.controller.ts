import { Request, Response } from "express";
import { MonitorService } from "./monitor.service";

const monitorService = new MonitorService();

export const create = async (req: Request, res: Response) => {
  try {
    const monitor = await monitorService.create(req.body);
    return res.status(201).json({
      success: true,
      data: monitor,
      message: "Monitor criado com sucesso",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Erro ao criar monitor",
    });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await monitorService.findAll(page, limit);

    return res.status(200).json({
      success: true,
      data: result.monitores,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Erro ao buscar monitores",
    });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const monitor = await monitorService.findById(req.params.id);

    return res.status(200).json({
      success: true,
      data: monitor,
    });
  } catch (error: any) {
    const status = error.message === "Monitor não encontrado" ? 404 : 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Erro ao buscar monitor",
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const monitor = await monitorService.update(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      data: monitor,
      message: "Monitor atualizado com sucesso",
    });
  } catch (error: any) {
    const status = error.message === "Monitor não encontrado" ? 404 : 400;
    return res.status(status).json({
      success: false,
      message: error.message || "Erro ao atualizar monitor",
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await monitorService.delete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Monitor excluído com sucesso",
    });
  } catch (error: any) {
    const status = error.message === "Monitor não encontrado" ? 404 : 400;
    return res.status(status).json({
      success: false,
      message: error.message || "Erro ao excluir monitor",
    });
  }
};

export const getByProfessorId = async (req: Request, res: Response) => {
  try {
    const monitores = await monitorService.findByProfessorId(req.params.professorId);

    return res.status(200).json({
      success: true,
      data: monitores,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Erro ao buscar monitores do professor",
    });
  }
};
