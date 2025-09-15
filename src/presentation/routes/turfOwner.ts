import { Request, Response } from "express";
import {
  authController,
  turfController,
  turfOwnerController,
  userController,
} from "../di/resolver";
import { BaseRoute } from "./base_route";
import { decodeToken, verifyAuth } from "../middlewares/auth_middleware";

export class OwnerRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.post(
      "/turfOwner/refresh-session",
      verifyAuth,
      (req: Request, res: Response) => {
        userController.refreshSession(req, res);
      }
    );
    this.router.post(
      "/turfOwner/add-turf",
      verifyAuth,
      (req: Request, res: Response) => {
        turfOwnerController.addTurf(req, res);
      }
    );

    this.router.get(
      "/turfOwner/profile",
      verifyAuth,
      (req: Request, res: Response) => {
        turfOwnerController.getOwnerDetails(req, res);
      }
    );
    this.router.put(
      '/turfOwner/request-update-profile',
      verifyAuth,
      (req:Request,res:Response) =>{
        turfOwnerController.requestUpdateProfile(req,res);
      }
    )

    this.router.post(
      "/turfOwner/refresh-token",
      decodeToken,
      (req: Request, res: Response) => {
        authController.handleTokenRefresh(req, res);
      }
    );

    this.router.put(
      "/turfOwner/update-profile",
      verifyAuth,
      (req: Request, res: Response) => {
        turfOwnerController.updateTurfOwnerProfile(req, res);
      }
    );
    this.router.get(
      "/turfOwner/get-my-turf",
      verifyAuth,
      (req:Request,res:Response) =>{
        turfController.getMyTurf(req,res)
      }
    )

    this.router.get('/turfOwner/get-turfdetails/:id',
      verifyAuth,
      (req:Request,res:Response) =>{
        turfController.getTurfById(req,res)
      }
    )
    this.router.put('/turfOwner/update-turf/:id',
      verifyAuth,
      (req:Request,res:Response)=>{
        turfController.updateTurf(req,res)
      }
    )

    this.router.post(
      "/turfOwner/retry-approval",
      verifyAuth,
      (req: Request, res: Response) => {
        turfOwnerController.retryAdminApproval(req, res);
      }
    );
    this.router.post(
      "/turfOwner/logout",
      verifyAuth,
      (req: Request, res: Response) => {
        authController.logout(req, res);
      }
    );
  }
}
