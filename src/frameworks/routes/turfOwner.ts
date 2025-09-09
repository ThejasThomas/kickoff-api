import { Request, Response } from "express";
import { authController, turfOwnerController } from "../di/resolver";
import { BaseRoute } from "./base_route";
import {
  decodeToken,
  verifyAuth,
} from "../../interfaceAdapters/middlewares/auth_middleware";

export class OwnerRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.post(
      "/turfOwner/add-turf",
      verifyAuth,
      (req: Request, res: Response) => {
        console.log("helooooooooooooooo");
        turfOwnerController.addTurf(req, res);
      }
    );

    this.router.get(
      '/turfOwner/profile',
      verifyAuth,
      (req:Request,res:Response) =>{
        turfOwnerController.getOwnerDetails(req,res)
      }
    )
    
    this.router.post(
      "/turfOwner/refersh-token",
      decodeToken,
      (req: Request, res: Response) => {
        authController.handleTokenRefresh(req, res);
      }
    );

    this.router.put(
      '/turfOwner/update-profile',
      verifyAuth,
      (req:Request,res:Response) => {
        turfOwnerController.updateTurfOwnerProfile(req,res)
      }
    )
    this.router.post(
      '/turfOwner/logout',
      verifyAuth,
      (req:Request,res:Response)=>{
        authController.logout(req,res)
      }
    )
  }
}
