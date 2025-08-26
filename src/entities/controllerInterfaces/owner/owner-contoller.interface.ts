import { Request, Response } from "express";

export interface ITurfOwnerController {
    addTurf(req:Request,res:Response):Promise<void>
}