/*
  Warnings:

  - You are about to drop the column `semestre` on the `cursomateria` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `cursomateria` table. All the data in the column will be lost.
  - You are about to drop the column `turno` on the `cursomateria` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `CursoMateria` DROP COLUMN `semestre`,
    DROP COLUMN `tipo`,
    DROP COLUMN `turno`;
