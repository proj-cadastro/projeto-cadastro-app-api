/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `Curso` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Curso_codigo_key` ON `Curso`(`codigo`);
