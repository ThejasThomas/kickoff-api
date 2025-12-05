import { Request, Response } from "express";

export interface IWalletController{
    addMoney(req:Request,res:Response):Promise<void>
    getWalletBalance(req:Request,res:Response):Promise<void>
    getWalletHistory(req:Request,res:Response):Promise<void>
}
