import express from 'express'
import { getCallerDetails, webhookPostcall, webhookPreCall, handleUpdateBot , deleteBot , createBot ,getCallSummary, getBot, getAllBots } from '../controllers/bot'

export const botRouter = express.Router()
botRouter.post('/v1/caller-details',getCallerDetails )
botRouter.post('/webhook/pre-call',webhookPreCall )
botRouter.post('/webhook/post-call',webhookPostcall )
botRouter.get('/v1/call-summary', getCallSummary )


botRouter.patch("/openmic/v1/bots/:uid", handleUpdateBot)
botRouter.delete("/openmic/v1/bots/:uid", deleteBot)
botRouter.get('/openmic/v1/bots',getAllBots)
botRouter.post('/openmic/v1/bots' ,createBot)
botRouter.get('/openmic/v1/bots/:uid' , async(req,res)=>{
    try {
        const bot = await getBot(req.params.uid)
        return res.status(200).json({data: bot})
    } catch (error) {
        return res.status(500).json({error: "Internal server error"})
    }
})

