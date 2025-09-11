import { Request, Response } from "express";
import { BaseRoute } from "./base_route";
import { authController, turfController, userController } from "../di/resolver";
import { decodeToken, verifyAuth } from "../middlewares/auth_middleware";


export class AdminRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.get(
      "/admin/users",
      verifyAuth,
      (req: Request, res: Response) => {
        userController.getAllUsers(req, res);
      }
    );
    this.router.patch(
      "/admin/status",
      verifyAuth,
      (req: Request, res: Response) => {
        userController.updateEntityStatus(req, res);
      }
    );
    this.router.post(
      '/admin/logout',
      verifyAuth,
      (req:Request,res:Response) =>{
        authController.logout(req,res)
      }
    )
    this.router.get(
      "/admin/turfs",
      verifyAuth,
      (req:Request,res:Response) =>{
        turfController.getAllTurfs(req,res)
      }
    )
    this.router.post(
      "/admin/refresh-token",
      decodeToken,
      (req: Request, res: Response) => {
        authController.handleTokenRefresh(req, res);
      }
    );
  }
}
