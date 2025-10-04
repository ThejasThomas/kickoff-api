// export interface IUserController {
//     // refreshSession(req:Request,res:Response):Promise<void>;
//     getAllUsers(req:Request,res:Response)
// }

import { Request, Response } from "express";

export interface IUserController{
    getAllUsers(req:Request, res:Response):Promise<void>
    updateEntityStatus(req:Request,res:Response):Promise<void>
    refreshSession(req:Request,res:Response):Promise<void>
    getUserDetails(req:Request,res:Response):Promise<void>
    getBookedUserDetails(req:Request,res:Response):Promise<void>
}

