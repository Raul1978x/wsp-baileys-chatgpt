/*
  Warnings:

  - You are about to drop the `WhatsAppSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ');

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "status" "MessageStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "qrCode" TEXT,
ALTER COLUMN "isActive" SET DEFAULT false;

-- DropTable
DROP TABLE "WhatsAppSession";
