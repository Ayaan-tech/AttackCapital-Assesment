/*
  Warnings:

  - The primary key for the `CallSummary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `callId` on the `CallSummary` table. All the data in the column will be lost.
  - The `nextAppointment` column on the `CallSummary` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `dateOfBirth` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[externalSessionId]` on the table `CallSummary` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `date` on the `Appointment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `time` on the `Appointment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."CallSummary" DROP CONSTRAINT "CallSummary_appointmentId_fkey";

-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "time",
ADD COLUMN     "time" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."CallSummary" DROP CONSTRAINT "CallSummary_pkey",
DROP COLUMN "callId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dynamicVariables" JSONB,
ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "externalSessionId" TEXT,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "isSuccessful" BOOLEAN DEFAULT false,
ADD COLUMN     "transcript" JSONB,
ALTER COLUMN "appointmentId" DROP NOT NULL,
ALTER COLUMN "notes" DROP NOT NULL,
DROP COLUMN "nextAppointment",
ADD COLUMN     "nextAppointment" TIMESTAMP(3),
ADD CONSTRAINT "CallSummary_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "dateOfBirth",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CallSummary_externalSessionId_key" ON "public"."CallSummary"("externalSessionId");

-- AddForeignKey
ALTER TABLE "public"."CallSummary" ADD CONSTRAINT "CallSummary_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."Appointment"("appointmentId") ON DELETE SET NULL ON UPDATE CASCADE;
