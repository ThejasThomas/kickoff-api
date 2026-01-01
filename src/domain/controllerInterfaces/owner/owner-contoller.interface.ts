import { Request, Response } from "express";

export interface ITurfOwnerController {
    addTurf(req:Request,res:Response):Promise<void>
    getOwnerDetails(req:Request,res:Response) :Promise<void>
    updateTurfOwnerProfile(req:Request,res:Response):Promise<void>
    retryAdminApproval(req:Request,res:Response):Promise<void>
    requestUpdateProfile(req:Request,res:Response):Promise<void>
    getDashboard(req:Request,res:Response):Promise<void>
}
