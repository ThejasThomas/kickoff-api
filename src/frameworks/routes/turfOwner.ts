import { Request, Response } from "express";
import { turfOwnerController } from "../di/resolver";
import { BaseRoute } from "./base_route";
import { verifyAuth } from "../../interfaceAdapters/middlewares/auth_middleware";

export class OwnerRoutes extends BaseRoute {
    constructor(){
    super()
    }

    protected initializeRoutes(): void {
        this.router.post(
            '/turfOwner/add-turf',verifyAuth,(req:Request,res:Response)=>{
                console.log('helooooooooooooooo')
                turfOwnerController.addTurf(req,res)
            }
        )
    }
}
