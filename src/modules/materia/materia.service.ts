import prisma from "../../prisma/client";
import { CreateMateriaDto } from "../../types/materia.dto";

const materiaInclude = {
  professor: true,
  cursos: {
    include: {
      curso: true,
    },
  },
};

export async function createMateria(data: CreateMateriaDto) {
  const { cursos, ...materiaData } = data;

  return await prisma.materia.create({
    data: {
      ...materiaData,
      cursos: {
        create: cursos.map((c) => ({ cursoId: String(c.cursoId) })),
      },
    },
    include: materiaInclude,
  });
}

export async function getAllMaterias() {
  return await prisma.materia.findMany({
    include: materiaInclude,
  });
}

export async function getMateriaById(id: string) {
  return await prisma.materia.findUnique({
    where: { id },
    include: materiaInclude,
  });
}

export async function updateMateria(
  id: string,
  data: Partial<CreateMateriaDto>
) {
  const { cursos, ...materiaData } = data;

  await prisma.materia.update({
    where: { id },
    data: materiaData,
  });

  if (cursos) {
    await prisma.cursoMateria.deleteMany({ where: { materiaId: id } });

    await prisma.cursoMateria.createMany({
      data: cursos.map((c) => ({ cursoId: String(c.cursoId), materiaId: id })),
      skipDuplicates: true,
    });
  }

  return await getMateriaById(id);
}

export async function deleteMateria(id: string) {
  await prisma.cursoMateria.deleteMany({ where: { materiaId: id } });
  return await prisma.materia.delete({ where: { id } });
}

export async function checkCoursesId(cursoIds: string[]): Promise<boolean> {
  const cursos = await prisma.curso.findMany({
    where: { id: { in: cursoIds } },
    select: { id: true },
  });

  return cursos.length === cursoIds.length;
}

export async function isMateriaUnicaEmCurso(
  materiaId: string
): Promise<boolean> {
  const count = await prisma.cursoMateria.count({ where: { materiaId } });
  return count === 1;
}
