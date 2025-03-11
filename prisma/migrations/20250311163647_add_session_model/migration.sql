/*
  Warnings:

  - You are about to drop the column `sessionKey` on the `sessions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sessionName]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sender` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionName` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "sessions_sessionKey_key";

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "sender" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "sessionKey",
ADD COLUMN     "sessionName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionName_key" ON "sessions"("sessionName");
