/*
  Warnings:

  - A unique constraint covering the columns `[coordenadorId]` on the table `Curso` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Curso_coordenadorId_key` ON `Curso`(`coordenadorId`);
