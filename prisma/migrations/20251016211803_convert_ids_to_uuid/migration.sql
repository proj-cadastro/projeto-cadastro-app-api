/*
  Warnings:

  - The primary key for the `Curso` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CursoMateria` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `HorarioTrabalho` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Materia` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Monitor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Ponto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Professor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Curso` DROP FOREIGN KEY `Curso_coordenadorId_fkey`;

-- DropForeignKey
ALTER TABLE `CursoMateria` DROP FOREIGN KEY `CursoMateria_cursoId_fkey`;

-- DropForeignKey
ALTER TABLE `CursoMateria` DROP FOREIGN KEY `CursoMateria_materiaId_fkey`;

-- DropForeignKey
ALTER TABLE `HorarioTrabalho` DROP FOREIGN KEY `HorarioTrabalho_monitorId_fkey`;

-- DropForeignKey
ALTER TABLE `Materia` DROP FOREIGN KEY `Materia_professorId_fkey`;

-- DropForeignKey
ALTER TABLE `Monitor` DROP FOREIGN KEY `Monitor_professorId_fkey`;

-- DropForeignKey
ALTER TABLE `Ponto` DROP FOREIGN KEY `Ponto_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `Usuario` DROP FOREIGN KEY `Usuario_monitorId_fkey`;

-- DropIndex
DROP INDEX `CursoMateria_materiaId_fkey` ON `CursoMateria`;

-- DropIndex
DROP INDEX `Materia_professorId_fkey` ON `Materia`;

-- DropIndex
DROP INDEX `Monitor_professorId_fkey` ON `Monitor`;

-- DropIndex
DROP INDEX `Ponto_usuarioId_fkey` ON `Ponto`;

-- AlterTable
ALTER TABLE `Curso` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `coordenadorId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `CursoMateria` DROP PRIMARY KEY,
    MODIFY `cursoId` VARCHAR(191) NOT NULL,
    MODIFY `materiaId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`cursoId`, `materiaId`);

-- AlterTable
ALTER TABLE `HorarioTrabalho` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `monitorId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Materia` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `professorId` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Monitor` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `professorId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Ponto` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `usuarioId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Professor` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Usuario` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `monitorId` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Materia` ADD CONSTRAINT `Materia_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `Professor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Curso` ADD CONSTRAINT `Curso_coordenadorId_fkey` FOREIGN KEY (`coordenadorId`) REFERENCES `Professor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CursoMateria` ADD CONSTRAINT `CursoMateria_cursoId_fkey` FOREIGN KEY (`cursoId`) REFERENCES `Curso`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CursoMateria` ADD CONSTRAINT `CursoMateria_materiaId_fkey` FOREIGN KEY (`materiaId`) REFERENCES `Materia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_monitorId_fkey` FOREIGN KEY (`monitorId`) REFERENCES `Monitor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Monitor` ADD CONSTRAINT `Monitor_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `Professor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HorarioTrabalho` ADD CONSTRAINT `HorarioTrabalho_monitorId_fkey` FOREIGN KEY (`monitorId`) REFERENCES `Monitor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ponto` ADD CONSTRAINT `Ponto_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
