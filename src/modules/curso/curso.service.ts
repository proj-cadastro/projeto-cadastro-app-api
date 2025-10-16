import prisma from "../../prisma/client";
import { CreateCursoDto } from "../../types/curso.dto";

const cursoInclude = {
  materias: {
    include: {
      materia: {
        include: {
          professor: true,
        },
      },
    },
  },
  coordenador: true,
};

export async function createCurso(data: CreateCursoDto) {
  return await prisma.curso.create({ data });
}

export async function getAllCursos() {
  return await prisma.curso.findMany({
    include: cursoInclude,
  });
}

export async function getCursoById(id: string) {
  return await prisma.curso.findUnique({
    where: { id },
    include: cursoInclude,
  });
}

export async function updateCurso(id: string, data: Partial<CreateCursoDto>) {
  await prisma.curso.update({ where: { id }, data });
  return await getCursoById(id);
}

export async function deleteCurso(id: string) {
  return await prisma.curso.delete({ where: { id } });
}

export async function isCursoExists(id: string): Promise<boolean> {
  const curso = await prisma.curso.findUnique({ where: { id } });
  return !!curso;
}

export async function areCursosExist(cursos: any[]): Promise<boolean> {
  const ids = cursos.every((c) => typeof c === "string")
    ? cursos
    : cursos.map((c: any) => c.cursoId);

  const count = await prisma.curso.count({ where: { id: { in: ids } } });
  return count === ids.length;
}

export async function getCursosByCoordenadorId(coordenadorId: string) {
  return await prisma.curso.findMany({ where: { coordenadorId } });
}
