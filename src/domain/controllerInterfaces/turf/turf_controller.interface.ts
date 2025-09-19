import { Request, Response } from "express";

export interface ITurfController{
    getAllTurfs(req:Request,res:Response):Promise<void>
    getMyTurf(req:Request,res:Response):Promise<void>
    getTurfById(req:Request,res:Response):Promise<void>
    updateTurf(req:Request,res:Response):Promise<void>
    generateSlots(req:Request,res:Response):Promise<void>
    getSlots(req:Request,res:Response):Promise<void>
}