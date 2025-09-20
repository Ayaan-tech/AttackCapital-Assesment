import * as z from "zod";

export const PreCallSchema = z.object({
    patientId : z.string().min(1, "Patient ID is required"),
    firstname : z.string().min(1, "First name is required"),
    lastname : z.string().min(1, "Last name is required"),
    dateOfBirth : z.string().min(1, "Date of Birth is required"),
    phoneNumber : z.string().min(1, "Phone number is required"),
    email : z.string().email("Invalid email address"),
    allergies : z.string().optional(),
    medications : z.string().optional(),
    lastVisit : z.string().optional(),
});


export const PostWebHookSchema =z.object({
    appointmentId: z.number().optional(),
    sessionId: z.string().min(1, "Session ID is required"),
    toPhone: z.string().min(1, "To phone number is required"),
    fromPhone: z.string().min(1, "From phone number is required"),
    callType: z.enum(["phonecall", "voicemail"]).optional(),
    direction: z.enum(["inbound", "outbound"]).optional(),
    createdAt: z.string().min(1, "Created at is required"),
    endedAt: z.string().min(1, "Ended at is required"),
    transcript: z.array(z.string()).min(1, "Transcript is required"),
    summary: z.string().min(1, "Summary is required"),
    isSuccessful: z.boolean().optional(),
    dynamicVariables:z.record(z.string(), z.any()).optional(),

})