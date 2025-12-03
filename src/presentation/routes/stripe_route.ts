import { Request, Response } from "express";
import { authController, turfController, userController } from "../di/resolver";
import { BaseRoute } from "./base_route";
import { verifyAuth } from "../middlewares/auth_middleware";

export class PaymentRoutes extends BaseRoute {
    constructor(){
        super()
    }
    protected initializeRoutes(): void {
        this.router.post('/create-checkout-session',(req:Request,res:Response)=>{
            userController.stripePaymentSession(req,res)
        })
        this.router.get("/verify-session/:id",
            // verifyAuth,
            (req:Request,res:Response) =>{
                userController.verifyPaymentSession(req,res)
            }
        )
    }

}
