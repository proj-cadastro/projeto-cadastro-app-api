import { Request, Response } from "express";

import { PontoService } from "./ponto.service";

const pontoService = new PontoService();

function parseDateQuery(value: any): Date | undefined {
  if (!value) return undefined;
  const d = new Date(String(value));
  return isNaN(d.getTime()) ? undefined : d;
}

export const registrarEntrada = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const usuarioId: string = user?.id || user?.userId;

    const ponto = await pontoService.registrarEntrada(usuarioId);

    return res.status(201).json({
      success: true,
      data: ponto,
      message: "Entrada registrada com sucesso",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Erro ao registrar entrada",
    });
  }
};

export const registrarSaida = async (req: Request, res: Response) => {
  try {
    const pontoId = req.params.pontoId;
    const ponto = await pontoService.registrarSaida(pontoId);

    return res.status(200).json({
      success: true,
      data: ponto,
      message: "Saída registrada com sucesso",
    });
  } catch (error: any) {
    const status = error.message === "Ponto não encontrado" ? 404 : 400;
    return res.status(status).json({
      success: false,
      message: error.message || "Erro ao registrar saída",
    });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const ponto = await pontoService.create(req.body);
    return res.status(201).json({
      success: true,
      data: ponto,
      message: "Ponto criado com sucesso",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Erro ao criar ponto",
    });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const usuarioId = req.query.usuarioId
      ? String(req.query.usuarioId)
      : undefined;
    const dataInicio = parseDateQuery(req.query.dataInicio);
    const dataFim = parseDateQuery(req.query.dataFim);

    const result = await pontoService.findAll(
      page,
      limit,
      usuarioId,
      dataInicio,
      dataFim
    );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Erro ao buscar pontos",
    });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const ponto = await pontoService.findById(id);
    return res.status(200).json({ success: true, data: ponto });
  } catch (error: any) {
    const status = error.message === "Ponto não encontrado" ? 404 : 500;
    return res
      .status(status)
      .json({
        success: false,
        message: error.message || "Erro ao buscar ponto",
      });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const ponto = await pontoService.update(id, req.body);
    return res
      .status(200)
      .json({
        success: true,
        data: ponto,
        message: "Ponto atualizado com sucesso",
      });
  } catch (error: any) {
    const status = error.message === "Ponto não encontrado" ? 404 : 400;
    return res
      .status(status)
      .json({
        success: false,
        message: error.message || "Erro ao atualizar ponto",
      });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await pontoService.delete(id);
    return res
      .status(200)
      .json({ success: true, message: "Ponto excluído com sucesso" });
  } catch (error: any) {
    const status = error.message === "Ponto não encontrado" ? 404 : 400;
    return res
      .status(status)
      .json({
        success: false,
        message: error.message || "Erro ao excluir ponto",
      });
  }
};

export const getByUsuarioId = async (req: Request, res: Response) => {
  try {
    const usuarioId = String(req.params.usuarioId);
    const dataInicio = parseDateQuery(req.query.dataInicio);
    const dataFim = parseDateQuery(req.query.dataFim);

    const pontos = await pontoService.findByUsuarioId(
      usuarioId,
      dataInicio,
      dataFim
    );
    return res.status(200).json({ success: true, data: pontos });
  } catch (error: any) {
    return res
      .status(500)
      .json({
        success: false,
        message: error.message || "Erro ao buscar pontos do usuário",
      });
  }
};

export const getPontoAberto = async (req: Request, res: Response) => {
  try {
    const usuarioId = String(req.params.usuarioId);
    const ponto = await pontoService.getPontoAbertoByUsuario(usuarioId);
    return res.status(200).json({ success: true, data: ponto });
  } catch (error: any) {
    return res
      .status(500)
      .json({
        success: false,
        message: error.message || "Erro ao buscar ponto aberto",
      });
  }
};

export const getMeusPontos = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const usuarioId: string = user?.id || user?.userId;
    const dataInicio = parseDateQuery(req.query.dataInicio);
    const dataFim = parseDateQuery(req.query.dataFim);

    const pontos = await pontoService.findByUsuarioId(
      usuarioId,
      dataInicio,
      dataFim
    );
    return res.status(200).json({ success: true, data: pontos });
  } catch (error: any) {
    return res
      .status(500)
      .json({
        success: false,
        message: error.message || "Erro ao buscar seus pontos",
      });
  }
};

export const getMeuPontoAberto = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const usuarioId: string = user?.id || user?.userId;
    const ponto = await pontoService.getPontoAbertoByUsuario(usuarioId);
    return res.status(200).json({ success: true, data: ponto });
  } catch (error: any) {
    return res
      .status(500)
      .json({
        success: false,
        message: error.message || "Erro ao buscar seu ponto aberto",
      });
  }
};
