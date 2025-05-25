-- CreateTable
CREATE TABLE `Professor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `titulacao` ENUM('DOUTOR', 'MESTRE', 'ESPECIALISTA') NOT NULL,
    `idUnidade` VARCHAR(5) NOT NULL,
    `referencia` ENUM('PES_I_A', 'PES_I_B', 'PES_I_C', 'PES_I_D', 'PES_I_E', 'PES_I_F', 'PES_I_G', 'PES_I_H', 'PES_II_A', 'PES_II_B', 'PES_II_C', 'PES_II_D', 'PES_II_E', 'PES_II_F', 'PES_II_G', 'PES_II_H', 'PES_III_A', 'PES_III_B', 'PES_III_C', 'PES_III_D', 'PES_III_E', 'PES_III_F', 'PES_III_G', 'PES_III_H') NOT NULL,
    `lattes` VARCHAR(191) NOT NULL,
    `statusAtividade` ENUM('ATIVO', 'AFASTADO', 'LICENCA', 'NAO_ATIVO') NOT NULL,
    `observacoes` VARCHAR(191) NULL,

    UNIQUE INDEX `Professor_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Materia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `cargaHoraria` INTEGER NOT NULL,
    `professorId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Curso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `codigo` VARCHAR(4) NOT NULL,
    `sigla` VARCHAR(4) NOT NULL,
    `modelo` ENUM('PRESENCIAL', 'HIBRIDO', 'EAD') NOT NULL,
    `coordenadorId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CursoMateria` (
    `cursoId` INTEGER NOT NULL,
    `materiaId` INTEGER NOT NULL,
    `semestre` INTEGER NOT NULL,
    `turno` ENUM('MATUTINO', 'VESPERTINO', 'NOTURNO') NOT NULL,
    `tipo` ENUM('OBRIGATORIA', 'OPTATIVA') NOT NULL,

    PRIMARY KEY (`cursoId`, `materiaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Materia` ADD CONSTRAINT `Materia_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `Professor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Curso` ADD CONSTRAINT `Curso_coordenadorId_fkey` FOREIGN KEY (`coordenadorId`) REFERENCES `Professor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CursoMateria` ADD CONSTRAINT `CursoMateria_cursoId_fkey` FOREIGN KEY (`cursoId`) REFERENCES `Curso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CursoMateria` ADD CONSTRAINT `CursoMateria_materiaId_fkey` FOREIGN KEY (`materiaId`) REFERENCES `Materia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
