/*
  Warnings:

  - A unique constraint covering the columns `[lattes]` on the table `Professor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Professor_lattes_key` ON `Professor`(`lattes`);
