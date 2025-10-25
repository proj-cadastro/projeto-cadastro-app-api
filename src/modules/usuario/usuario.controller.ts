import { Request, Response } from "express";
import * as usuarioService from "./usuario.service";

export async function create(req: Request, res: Response) {
  try {
    const user = await usuarioService.createUsuario(req.body);
    return res.status(201).json({
      sucesso: true,
      mensagem: "Usuário criado com sucesso",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Erro ao criar usuário",
      erro: (error as Error).message,
    });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await usuarioService.getAllUsuarios(page, limit);

    if (!result.usuarios || result.usuarios.length === 0)
      return res
        .status(404)
        .json({ sucesso: false, mensagem: "Nenhum usuário encontrado" });

    return res.status(200).json({
      sucesso: true,
      mensagem: "Usuários encontrados com sucesso",
      data: result.usuarios,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Erro ao buscar usuários",
      erro: (error as Error).message,
    });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const usuario = await usuarioService.getUsuarioById(id);
    if (!usuario)
      return res
        .status(404)
        .json({ sucesso: false, mensagem: "Usuário não encontrado" });
    return res.status(200).json({
      sucesso: true,
      mensagem: "Usuário encontrado com sucesso",
      data: usuario,
    });
  } catch (error) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Erro ao buscar usuário",
      erro: (error as Error).message,
    });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = String(req.params.id);

    const usuario = await usuarioService.getUsuarioById(id);
    if (!usuario)
      return res.status(404).json({ mensagem: "Usuário não encontrado" });

    const usuarioAtualizado = await usuarioService.updateUsuario(id, req.body);
    return res.status(200).json({
      mensagem: "Usuário atualizado com sucesso",
      data: usuarioAtualizado,
    });
  } catch (error) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Erro ao atualizar usuário",
      erro: (error as Error).message,
    });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = String(req.params.id);

    const usuario = await usuarioService.getUsuarioById(id);
    if (!usuario)
      return res.status(404).json({ mensagem: "Usuário não encontrado" });

    await usuarioService.deleteUsuario(id);
    return res
      .status(204)
      .json({ sucesso: true, mensagem: "Usuário deletado com sucesso" });
  } catch (error) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Erro ao deletar usuário",
      erro: (error as Error).message,
    });
  }
}

export async function toggleStatus(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const usuario = await usuarioService.toggleUsuarioStatus(id);

    return res.status(200).json({
      sucesso: true,
      mensagem: `Usuário ${
        usuario.isActive ? "ativado" : "desativado"
      } com sucesso`,
      data: usuario,
    });
  } catch (error) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Erro ao alterar status do usuário",
      erro: (error as Error).message,
    });
  }
}

export async function createMonitorUser(req: Request, res: Response) {
  try {
    // Força o role como MONITOR para esta rota específica
    const userData = {
      ...req.body,
      role: "MONITOR" as const,
    };

    const user = await usuarioService.createUsuario(userData);
    return res.status(201).json({
      sucesso: true,
      mensagem: "Usuário monitor criado com sucesso",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Erro ao criar usuário monitor",
      erro: (error as Error).message,
    });
  }
}
