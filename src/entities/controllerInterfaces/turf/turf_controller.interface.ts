import { Request, Response } from "express";

export interface ITurfController{
    getAllTurfs(req:Request,res:Response):Promise<void>
}