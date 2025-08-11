import { authController } from "../di/resolver";
import { BaseRoute } from "./base_route";
import { Request, Response } from "express";


export class AuthRoutes extends BaseRoute{
    constructor(){
        super()
    }

    protected initializeRoutes(): void {
        this.router.post('/send-otp',(req:Request,res:Response)=>{
            authController.sendOtpEmail(req,res)
        })
        this.router.post('/verify-otp',(req:Request,res:Response) =>{
            console.log('helooo its verify')
            authController.verifyOtp(req,res)
        })
        this.router.post('/signup',(req:Request,res:Response)=>{
            authController.register(req,res)
        })
        this.router.post('/signin',(req:Request,res:Response)=>{
            authController.login(req,res)
        })
        this.router.post('/google-auth',(req:Request,res:Response)=>{
            authController.authenticateWithGoogle(req,res)
        })
    }
}
