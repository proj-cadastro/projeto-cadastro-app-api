-- DropForeignKey
ALTER TABLE `materia` DROP FOREIGN KEY `Materia_professorId_fkey`;

-- DropIndex
DROP INDEX `Materia_professorId_fkey` ON `materia`;

-- AlterTable
ALTER TABLE `materia` MODIFY `professorId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Materia` ADD CONSTRAINT `Materia_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `Professor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
