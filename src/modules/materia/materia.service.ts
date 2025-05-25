import prisma from '../../prisma/client';
import { CreateMateriaDto } from '../../types/materia.dto';

const materiaInclude = {
  professor: true,
  cursos: {
    include: {
      curso: true
    }
  }
};

export async function createMateria(data: CreateMateriaDto) {
  return await prisma.materia.create({ data });
}

export async function getAllMaterias() {
  return await prisma.materia.findMany({
    include: materiaInclude
  });
}

export async function getMateriaById(id: number) {
  return await prisma.materia.findUnique({
    where: { id },
    include: materiaInclude
  });
}

export async function updateMateria(id: number, data: Partial<CreateMateriaDto>) {
  await prisma.materia.update({ where: { id }, data });
  return await getMateriaById(id);
}

export async function deleteMateria(id: number) {
  return await prisma.materia.delete({ where: { id } });
}
