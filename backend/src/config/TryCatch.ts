import express ,{Request, Response, NextFunction ,RequestHandler} from 'express'

export const TryCatch = (handler:RequestHandler) =>{
    return async (req:Request, res:Response, next:NextFunction) => {
        try{
            await handler(req,res,next)
        }catch(err){
            res.status(500).json({message: "Internal Server Error", error: err})
            
        }
    }
}