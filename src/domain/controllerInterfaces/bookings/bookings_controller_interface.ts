import { Request, Response } from "express";

export interface IBookingsController {
    getAllbookings(req:Request,res:Response) :Promise<void>
}