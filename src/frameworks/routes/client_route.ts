import { Request, Response } from "express";
import { authorizeRole, decodeToken, verifyAuth } from "../../interfaceAdapters/middlewares/auth_middleware";
import { authController } from "../di/resolver";
import { BaseRoute } from "./base_route";

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
    }
}