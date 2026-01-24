import { Request, Response } from "express";
import { BaseRoute } from "./base_route";
import {
  adminController,
  authController,
  turfController,
  userController,
  walletController,
} from "../di/resolver";
import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../middlewares/auth_middleware";

export class AdminRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.get(
      "/admin/users",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        userController.getAllUsers(req, res);
      },
    );
    this.router.patch(
      "/admin/status",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        userController.updateEntityStatus(req, res);
      },
    );
    this.router.post(
      "/admin/logout",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        authController.logout(req, res);
      },
    );
    this.router.get(
      "/admin/turfs",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        turfController.getAllTurfs(req, res);
      },
    );
    this.router.post(
      "/admin/refresh-token",
      decodeToken,
      (req: Request, res: Response) => {
        authController.handleTokenRefresh(req, res);
      },
    );
    this.router.get(
      "/admin/refresh-session",
      verifyAuth,
      (req: Request, res: Response) => {
        userController.refreshSession(req, res);
      },
    );
    this.router.get(
      "/admin/get-turf-reviews/:turfId",
      verifyAuth,
      (req: Request, res: Response) => {
        turfController.getTurfReviewsForAdmin(req, res);
      },
    );
    this.router.get(
      "/admin/wallet",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        walletController.getAdminwallet(req, res);
      },
    );
    this.router.get(
      "/admin/wallet-transaction",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        walletController.getAdminWalletTransactions(req, res);
      },
    );
    this.router.delete(
      "/admin/delete-review/:reviewId",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        turfController.deleteReviewAdmin(req, res);
      },
    );
    this.router.get(
      "/admin/get-dashboard",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        adminController.adminDashboard(req, res);
      },
    );
    this.router.get(
      "/admin/owners-transaction",
      verifyAuth,
      (req: Request, res: Response) => {
        walletController.getAllOwnersTransactions(req, res);
      },
    );
    this.router.get(
      "/admin/transaction-details/:transactionId",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        walletController.getTransactionDetails(req, res);
      },
    );
  }
}
