import prisma from '../../prisma/client';
import { CreateProfessorDto } from '../../types/professor.dto';

const professorInclude = {
  materias: {
    include: {
      cursos: {
        include: {
          curso: true
        }
      }
    }
  },
  cursoCoordenado: true 
};

export async function createProfessor(data: CreateProfessorDto) {
  return await prisma.professor.create({ data });
}

export async function getAllProfessores() {
  return await prisma.professor.findMany({
    include: professorInclude
  });
}

export async function getProfessorById(id: number) {
  return await prisma.professor.findUnique({
    where: { id },
    include: professorInclude
  });
}

export async function updateProfessor(id: number, data: Partial<CreateProfessorDto>) {
  await prisma.professor.update({ where: { id }, data });
  return await getProfessorById(id);
}

export async function deleteProfessor(id: number) {
  return await prisma.professor.delete({ where: { id } });
}

export async function isProfessorExists(id: number): Promise<boolean> {
  const professor = await prisma.professor.findUnique({ where: { id } });
  return !!professor;
}

export async function isProfessorCoordenador(id: number): Promise<boolean> {
  const curso = await prisma.curso.findFirst({ where: { coordenadorId: id } });
  return !!curso;
}