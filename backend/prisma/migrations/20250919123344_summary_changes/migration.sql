/*
  Warnings:

  - You are about to drop the column `followUpActions` on the `CallSummary` table. All the data in the column will be lost.
  - You are about to drop the column `nextAppointment` on the `CallSummary` table. All the data in the column will be lost.
  - You are about to drop the column `prescriptions` on the `CallSummary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."CallSummary" DROP COLUMN "followUpActions",
DROP COLUMN "nextAppointment",
DROP COLUMN "prescriptions";
