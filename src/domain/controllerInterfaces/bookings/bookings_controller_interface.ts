import { Request, Response } from "express";

export interface IBookingsController {
    getAllbookings(req:Request,res:Response) :Promise<void>
    getUpcomingbookings(req:Request,res:Response):Promise<void>
    getTurfdetails(req:Request,res:Response):Promise<void>
    getPastbookings(req:Request,res:Response):Promise<void>
    requestCancellation(req:Request,res:Response):Promise<void>
    handleOwnerCancelRequest(req:Request,res:Response):Promise<void>
    getCancelRequestBookings(req:Request,res:Response):Promise<void>
    createGame(req:Request,res:Response):Promise<void>
    getUpcomingHostedGames(req:Request,res:Response):Promise<void>
    joinHostedGame(req:Request,res:Response):Promise<void>
    getSingleHostedGame(req:Request,res:Response):Promise<void>
}
