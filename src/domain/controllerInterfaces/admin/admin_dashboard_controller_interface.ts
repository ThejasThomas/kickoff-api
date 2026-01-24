import { Request, Response } from "express";

export interface IAdminController{
    adminDashboard(req:Request,res:Response):Promise<void>
}  