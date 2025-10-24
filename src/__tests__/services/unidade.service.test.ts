import { buscarUnidadeProxima } from '../../modules/unidade/unidade.service';

jest.mock('../../prisma/client', () => ({
  __esModule: true,
  default: {
    unidade: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock('../../utils/calculaDistancia', () => ({
  calculateDistanceKm: jest.fn(),
}));

import prisma from '../../prisma/client';
import { calculateDistanceKm } from '../../utils/calculaDistancia';

const mockPrisma = prisma as any;
const mockCalculateDistanceKm = calculateDistanceKm as jest.MockedFunction<typeof calculateDistanceKm>;

describe('Unidade Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUnidades = [
    {
      id: 'unidade-1',
      nome: 'Unidade Norte',
      latitude: -5.1,
      longitude: -42.8,
    },
    {
      id: 'unidade-2',
      nome: 'Unidade Sul',
      latitude: -5.2,
      longitude: -42.9,
    },
  ];

  describe('buscarUnidadeProxima', () => {
    it('should return nearest unit within 3km', async () => {
      mockPrisma.unidade.findMany.mockResolvedValue(mockUnidades);
      mockCalculateDistanceKm
        .mockReturnValueOnce(2.5)
        .mockReturnValueOnce(5.0);

      const result = await buscarUnidadeProxima(-5.1, -42.8);

      expect(result).toEqual({
        id: 'unidade-1',
        nome: 'Unidade Norte',
      });
    });

    it('should return null when no unit is within 3km', async () => {
      mockPrisma.unidade.findMany.mockResolvedValue(mockUnidades);
      mockCalculateDistanceKm
        .mockReturnValueOnce(4.0)
        .mockReturnValueOnce(5.0);

      const result = await buscarUnidadeProxima(-5.1, -42.8);

      expect(result).toBeNull();
    });

    it('should return the closest unit when multiple units are within range', async () => {
      const multipleUnidades = [
        ...mockUnidades,
        {
          id: 'unidade-3',
          nome: 'Unidade Centro',
          latitude: -5.15,
          longitude: -42.85,
        },
      ];

      mockPrisma.unidade.findMany.mockResolvedValue(multipleUnidades);
      mockCalculateDistanceKm
        .mockReturnValueOnce(2.5)
        .mockReturnValueOnce(2.8)
        .mockReturnValueOnce(1.2);

      const result = await buscarUnidadeProxima(-5.1, -42.8);

      expect(result).toEqual({
        id: 'unidade-3',
        nome: 'Unidade Centro',
      });
    });
  });
});
