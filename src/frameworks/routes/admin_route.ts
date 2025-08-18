import { Request, Response } from "express";
import { BaseRoute } from "./base_route";
import { userController } from "../di/resolver";

export class AdminRoutes extends BaseRoute {
    constructor(){
        super()
    }

        protected initializeRoutes(): void {
            this.router.get('/users',(req:Request,res:Response)=>{
                    userController.getAllUsers(req,res)
            })
            this.router.patch('/status',(req:Request,res:Response)=>{
                    userController.updateEntityStatus(req,res)
            })
            
        }




}