-- DropForeignKey
ALTER TABLE `cursomateria` DROP FOREIGN KEY `CursoMateria_cursoId_fkey`;

-- AddForeignKey
ALTER TABLE `CursoMateria` ADD CONSTRAINT `CursoMateria_cursoId_fkey` FOREIGN KEY (`cursoId`) REFERENCES `Curso`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
