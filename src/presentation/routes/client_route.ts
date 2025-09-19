import { Request, Response } from "express";
import { authController, turfController, userController } from "../di/resolver";
import { BaseRoute } from "./base_route";
import { decodeToken, verifyAuth } from "../middlewares/auth_middleware";

export class ClientRoutes extends BaseRoute {
  constructor() {
    super();
  }
  protected initializeRoutes(): void {
    this.router.post(
      "/client/refresh-session",
      verifyAuth,
      (req: Request, res: Response) => {
        userController.refreshSession(req, res);
      }
    );
    this.router.get(
      "/client/get-turfdetails/:id",
      verifyAuth,
      (req: Request, res: Response) => {
        turfController.getTurfById(req, res);
      }
    );
    this.router.get(
      "/client/getslots/:id",
      verifyAuth,
      (req: Request, res: Response) => {
        turfController.getSlots(req, res);
      }
    );
    this.router.post(
      "/client/refresh-token",
      decodeToken,
      (req: Request, res: Response) => {
        authController.handleTokenRefresh(req, res);
      }
    );
    this.router.get("/client/getturfs", (req: Request, res: Response) => {
      turfController.getAllTurfs(req, res);
    });
    this.router.post(
      "/client/logout",
      verifyAuth,
      (req: Request, res: Response) => {
        authController.logout(req, res);
      }
    );
  }
}
