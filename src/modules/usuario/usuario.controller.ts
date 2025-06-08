import { Request, Response } from 'express';
import * as usuarioService from './usuario.service';

export async function create(req: Request, res: Response) {
  try {
    const user = await usuarioService.createUsuario(req.body);
    return res.status(201).json({ sucesso: true, mensagem: "Usuário criado com sucesso", data: user });
  } catch (error) {
    return res.status(400).json({ sucesso: false, mensagem: "Erro ao criar usuário", erro: (error as Error).message });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    if (!usuarios || usuarios.length === 0)
      return res.status(404).json({ sucesso: false, mensagem: 'Nenhum usuário encontrado' });
    return res.status(200).json({ sucesso: true, mensagem: "Usuários encontrados com sucesso", data: usuarios });
  } catch (error) {
    return res.status(400).json({ sucesso: false, mensagem: "Erro ao buscar usuários", erro: (error as Error).message });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const usuario = await usuarioService.getUsuarioById(id);
    if (!usuario) return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
    return res.status(200).json({ sucesso: true, mensagem: "Usuário encontrado com sucesso", data: usuario });
  } catch (error) {
    return res.status(400).json({ sucesso: false, mensagem: "Erro ao buscar usuário", erro: (error as Error).message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const usuario = await usuarioService.updateUsuario(id, req.body);
    return res.status(200).json({  sucesso: true, mensagem: "Usuário atualizado com sucesso", data: usuario });
  } catch (error) {
    return res.status(400).json({ sucesso: false, mensagem: "Erro ao atualizar usuário", erro: (error as Error).message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await usuarioService.deleteUsuario(id);
    return res.status(204).json({ sucesso: true, mensagem: "Usuário deletado com sucesso" });
  } catch (error) {
    return res.status(400).json({ sucesso: false, mensagem: "Erro ao deletar usuário", erro: (error as Error).message });
  }
}
