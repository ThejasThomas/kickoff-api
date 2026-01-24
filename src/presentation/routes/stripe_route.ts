import { Request, Response } from "express";
import { bookingsController, userController } from "../di/resolver";
import { BaseRoute } from "./base_route";
import { authorizeRole, verifyAuth } from "../middlewares/auth_middleware";

export class PaymentRoutes extends BaseRoute {
  constructor() {
    super();
  }
  protected initializeRoutes(): void {
    this.router.post(
      "/create-checkout-session",
      (req: Request, res: Response) => {
        userController.stripePaymentSession(req, res);
      },
    );

    this.router.post(
      "/create-wallet-session",
      (req: Request, res: Response) => {
        userController.createWalletCheckoutSession(req, res);
      },
    );
    this.router.get(
      "/verify-session/:id",
      verifyAuth,
      authorizeRole(["client"]),
      (req: Request, res: Response) => {
        userController.verifyPaymentSession(req, res);
      },
    );
    
   
    this.router.post("/create-host-session", (req: Request, res: Response) => {
      userController.createHostedGameCheckoutSession(req, res);
    });
    this.router.post(
      "/create-join-hosted-game-session",
      (req: Request, res: Response) => {
        userController.createJoinHostedGameCheckoutSession(req, res);
      },
    );
  }
}
