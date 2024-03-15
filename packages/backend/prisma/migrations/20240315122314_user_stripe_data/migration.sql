-- AlterTable
ALTER TABLE `User` ADD COLUMN `activePlan` VARCHAR(191) NULL,
    ADD COLUMN `planValidUntil` DATETIME(3) NULL,
    ADD COLUMN `stripeCustomerId` VARCHAR(191) NULL,
    ADD COLUMN `stripeSubscriptionId` VARCHAR(191) NULL;
