import { Request, Response } from "express";
import { openmic } from "../config/api";
import prisma from "../config/db";
import { TryCatch } from "../config/TryCatch";
import { PostWebHookSchema, PreCallSchema } from "../config/zod";
import axios from "axios";
import dotenv from "dotenv";
import { CreateBotRequest, UpdateBotRequest } from "../config/types";


dotenv.config();
/////////////
export const getCallerDetails = TryCatch(async (req,res) =>{
    const patientDetails = await PreCallSchema.safeParseAsync(req.body)
    if(!patientDetails.success){
        return res.status(400).json({message:"Invalid patient details" })
    }
    if(!patientDetails.data.lastVisit){
        console.log("Creating new patient record")
        const created = await prisma.$transaction(async(tx) =>{
            const user = await tx.user.create({
            data:{
                firstname: patientDetails.data.firstname,
                lastname: patientDetails.data.lastname,
                phoneNumber: patientDetails.data.phoneNumber,
                email: patientDetails.data.email,
                allergies: patientDetails.data.allergies,
                medications: patientDetails.data.medications,
                dateOfBirth: patientDetails.data.dateOfBirth,
                lastVisit: new Date(),
            },
            include:{
                appointments:true,
            }
        })
        return user;
        })
        return res.status(200).json({message:"New patient record created" })
    }
    return res.status(201).json({ message: "New patient record created"});
})
///////////////////
export const handleUpdateBot = TryCatch(async (req,res)=>{
    const {uid} = req.params;
    const payload: UpdateBotRequest = req.body;
    if(!uid) return res.status(400).json({ error: "Missing bot uid" });
    try {
        const response = await openmic.patch(`/v1/bots/${uid}`, payload);
        if(response.status !== 200){
            return res.status(400).json({ error: "Error updating bot" });
        }
        const botData = response.data as UpdateBotRequest;
        
        return res.status(200).json({message:"Bot updated successfully", data: botData})
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }

})
export const deleteBot = TryCatch(async(req,res)=>{
    const uid = req.params.uid;
    if(!uid) return res.status(400).json({ error: "Missing bot uid" });
        const response = await openmic.delete(`/v1/bots/${uid}`);
        if(response.status !== 204){
            return res.status(400).json({ error: "Error deleting bot" });
        }
        return res.status(204).json({message:"Bot deleted successfully"})
})
export const createBot = async(req:Request,res:Response)=>{
    const payload: CreateBotRequest = req.body;
    if(!payload.name || !payload.prompt){
        return res.status(400).json({ error: "Missing required fields: name or prompt" });
    }
    console.log("Attempting to create bot on OpenMic with payload:", payload);

   try {
     const response = await openmic.post('/v1/bots', payload);
    if(response.status !== 201){
        return res.status(400).json({ error: "Error creating bot" });
    }
    return res.status(201).json({message:"Bot created successfully", data: response.data});
   } catch (error:any) {
    console.error("--- FULL ERROR OBJECT ---");
    console.error(error);
    console.error("--- END OF ERROR OBJECT ---");

    const status = error.response?.status || 500;
    const details = error.response?.data || "The request to OpenMic API failed.";
    
    return res.status(status).json({ 
      error: "Failed to create bot on OpenMic",
      details: details 
    });
   }
}

export const webhookPreCall = TryCatch(async (req,res)=>{
    console.log('📞 Pre-call webhook received:', JSON.stringify(req.body, null, 2));
    const testpatientId = req.query.patientId as string ;
    const callDetails = req.body.call;
    if(!callDetails || !callDetails.bot_id){
        return res.status(405).json({message:"Invalid call details" })
    }
    if(!testpatientId) return res.status(400).json({message:"No patient ID found"})

    
    let patient  = null;
    if(testpatientId){
        console.log(`Searching by patient ID : ${testpatientId}`)
        const testpatientIdAsInt = parseInt(testpatientId, 10);
        
        if(!isNaN(testpatientIdAsInt)){
            patient = await prisma.user.findUnique({
                where: { patientId: testpatientIdAsInt }
            });
        }
    }
    console.log('Patient details:', patient);
    if(!patient) console.log(`No patient found with ID: ${testpatientId}`);


   const dynamicVariables = {
    username: patient ? patient.firstname : "Valued Customer",
     lastCallSummary: patient && patient.lastVisit 
            ? `Your last visit was on ${patient.lastVisit.toLocaleDateString()}` 
            : "It looks like this is your first time contacting us. Welcome!",
    support_tier: "gold",
    preferred_language: "English",
    patient_id : patient ? patient.patientId : "unknown",
    allergies: patient?.allergies ?? "not in file",
    medications: patient?.medications ?? "not in file",
   }
   const repsonePayload = {
    call:{
        dynamic_variables: dynamicVariables
    }
   };
   return res.status(200).json(repsonePayload)
})

export const getAllBots = async (req: Request, res: Response) => {
  try {
    const response = await openmic.get('/v1/bots');
    return res.status(200).json(response.data);

  } catch (error: any) {
    // FIX: Add detailed logging to see the exact error from the API
    if (error.isAxiosError) {
      const status = error.response?.status;
      const data = error.response?.data;
      console.error(`Axios Error: Status ${status}`, data);

      if (status === 404) {
        console.log("No bots found on OpenMic, returning empty list.");
        return res.status(200).json({ data: [] });
      }
      
      // Handle other potential API errors like authentication failure
      if (status === 401 || status === 403) {
        return res.status(500).json({ error: "Authentication failed. Please check your OPENMIC_API_KEY." });
      }
    } else {
      console.error("Non-Axios Error in getAllBots:", error);
    }
    
    return res.status(500).json({ error: "An unexpected internal server error occurred." });
  }
};

export const webhookPostcall = TryCatch(async (req,res)=>{
     console.log('Post-call webhook received:', JSON.stringify(req.body, null, 2));
    const validatedData = await PostWebHookSchema.safeParseAsync(req.body)
    const callData = validatedData.data;
    if(!validatedData.success) return res.status(400).json({message:"Error fetching Appointment Details" })
    let appointmentIdasint = null;
    if(callData?.appointmentId){
        const parseId =  callData.appointmentId;
        if(!isNaN(parseId)){
            appointmentIdasint = parseId;
        }
    }

    const created = await prisma.callSummary.create({
        data:{
            externalSessionId: callData?.sessionId,
            appointmentId: appointmentIdasint,
            notes: callData?.summary,
            transcript: Array.isArray(callData?.transcript) ? callData.transcript.join("\n") : "",
            isSuccessful: callData?.isSuccessful,
            dynamicVariables: callData?.dynamicVariables 
        }
    })
    console.log(`✅ Successfully saved call summary for session: ${callData?.sessionId}`);
    return res.status(200).json({ message: "Webhook received and processed successfully." });
})

export const getCallSummary =TryCatch(async(req,res)=>{
    const summaries = await prisma.callSummary.findMany({
        orderBy:{externalSessionId:'desc'},
        take:10
    });
    return res.status(200).json({data:summaries});
})



export async function getBot(uid:string):Promise<CreateBotRequest>{
    try {
        const response = await openmic.get(`/v1/bots/${uid}`);
        if(response.status !== 200){
            throw new Error("Error fetching bot")
        }
        return response.data as CreateBotRequest;
    } catch (error) {
        throw new Error("Internal server error");
    }
}