-- CreateTable
CREATE TABLE "public"."User" (
    "patientId" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "allergies" TEXT,
    "medications" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("patientId")
);

-- CreateTable
CREATE TABLE "public"."Appointment" (
    "appointmentId" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "patientId" INTEGER NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("appointmentId")
);

-- CreateTable
CREATE TABLE "public"."CallSummary" (
    "callId" SERIAL NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,
    "followUpActions" TEXT,
    "prescriptions" TEXT,
    "nextAppointment" TEXT,

    CONSTRAINT "CallSummary_pkey" PRIMARY KEY ("callId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "public"."User"("phoneNumber");

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."User"("patientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CallSummary" ADD CONSTRAINT "CallSummary_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."Appointment"("appointmentId") ON DELETE RESTRICT ON UPDATE CASCADE;
