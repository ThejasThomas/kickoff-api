import { Request, Response } from "express";
import { authorizeRole, decodeToken, verifyAuth } from "../../interfaceAdapters/middlewares/auth_middleware";
import { authController, turfController } from "../di/resolver";
import { BaseRoute } from "./base_route";
import { TurfController } from "../../interfaceAdapters/controllers/turf_controller";

export class ClientRoutes extends BaseRoute {
    constructor() {
        super();
    }
    protected initializeRoutes(): void {
        this.router.post(
            '/client/refresh-token',
            decodeToken,
            (req:Request,res:Response) =>{
                authController.handleTokenRefresh(req,res);
            }
        )
        this.router.get(
            '/client/getturfs',
            (req:Request,res:Response) =>{
                turfController.getAllTurfs(req,res);
            }
        )
        this.router.post(
            '/client/logout',
            verifyAuth,
            (req:Request,res:Response) => {
                authController.logout(req,res)
            }
        )
    }
}