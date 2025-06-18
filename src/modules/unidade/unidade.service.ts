import prisma from '../../prisma/client';
import { calculateDistanceKm } from '../../utils/calculaDistancia';

export async function buscarUnidadeProxima(latitude: number, longitude: number) {
  const unidades = await prisma.unidade.findMany();

  let unidadeMaisProxima = null;
  let menorDistancia = Infinity;

  for (const unidade of unidades) {
    const dist = calculateDistanceKm(latitude, longitude, unidade.latitude, unidade.longitude);
    if (dist <= 2 && dist < menorDistancia) {
      menorDistancia = dist;
      unidadeMaisProxima = unidade;
    }
  }

  if (unidadeMaisProxima) {
    return {
      id: unidadeMaisProxima.id,
      nome: unidadeMaisProxima.nome
    };
  }

  return null;
}
