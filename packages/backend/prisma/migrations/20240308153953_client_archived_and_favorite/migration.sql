-- AlterTable
ALTER TABLE `Client` ADD COLUMN `isArchived` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isFavorite` BOOLEAN NOT NULL DEFAULT false;
