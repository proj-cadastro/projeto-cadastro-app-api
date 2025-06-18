import { Request, Response } from 'express';
import { buscarUnidadeProxima } from './unidade.service';

export const unidadeProximaController = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) 
      return res.status(400).json({ sucesso: false, mensagem: 'Latitude e longitude são obrigatórios.' });

    const unidade = await buscarUnidadeProxima(latitude, longitude);

    return res.status(200).json({ sucesso: true, dados: unidade ?? null });
  } catch (error) {
    console.error('Erro ao buscar unidade próxima:', error);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
  }
};
