import { Request, Response } from 'express';
import { buscarUnidadeProxima } from './unidade.service';

export const unidadeProximaController = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude e longitude são obrigatórios.' });
    }

    const unidade = await buscarUnidadeProxima(latitude, longitude);

    return res.status(200).json(unidade ?? null); // Pode ser null se não encontrar
  } catch (error) {
    console.error('Erro ao buscar unidade próxima:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
