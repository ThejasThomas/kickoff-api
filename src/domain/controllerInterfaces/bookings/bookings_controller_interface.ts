import { Request, Response } from "express";

export interface IBookingsController {
    getAllbookings(req:Request,res:Response) :Promise<void>
    getUpcomingbookings(req:Request,res:Response):Promise<void>
    getTurfdetails(req:Request,res:Response):Promise<void>
    getPastbookings(req:Request,res:Response):Promise<void>
}