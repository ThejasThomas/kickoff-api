import { Request, Response } from "express";
import {
  authController,
  bookingsController,
  turfController,
  userController,
  walletController,
} from "../di/resolver";
import { BaseRoute } from "./base_route";
import { decodeToken, verifyAuth } from "../middlewares/auth_middleware";

export class ClientRoutes extends BaseRoute {
  constructor() {
    super();
  }
  protected initializeRoutes(): void {
    this.router.get(
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
      "/client/get-user-profile",
      verifyAuth,
      (req: Request, res: Response) => {
        userController.getUserDetails(req, res);
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
      "/client/hold-slot",
      verifyAuth,
      (req: Request, res: Response) => {
        bookingsController.holdSlot(req, res);
      }
    );
    this.router.post(
      "/client/bookslots",
      verifyAuth,
      (req: Request, res: Response) => {
        turfController.bookslots(req, res);
      }
    );

    this.router.get(
      "/client/get-user-profile",
      verifyAuth,
      (req: Request, res: Response) => {
        userController.getUserDetails(req, res);
      }
    );
    this.router.patch(
      "/client/update-user-details",
      verifyAuth,
      (req: Request, res: Response) => {
        userController.updateUserDetails(req, res);
      }
    );

    this.router.get(
      "/client/getnearbyturf",
      verifyAuth,
      (req: Request, res: Response) => {
        turfController.getnearbyturfs(req, res);
      }
    );
    this.router.get(
      "/client/get-upcoming-bookings",
      verifyAuth,
      (req: Request, res: Response) => {
        bookingsController.getUpcomingbookings(req, res);
      }
    );
    this.router.get(
      "/client/getbookingturf",
      verifyAuth,
      (req: Request, res: Response) => {
        bookingsController.getTurfdetails(req, res);
      }
    );

    this.router.get(
      "/client/get-past-bookings",
      verifyAuth,
      (req: Request, res: Response) => {
        bookingsController.getPastbookings(req, res);
      }
    );

    this.router.post(
      "/client/add-money",
      verifyAuth,
      (req: Request, res: Response) => {
        walletController.addMoney(req, res);
      }
    );
    this.router.get(
      "/client/walletbalance",
      verifyAuth,
      (req: Request, res: Response) => {
        walletController.getWalletBalance(req, res);
      }
    );
    this.router.get(
      "/client/transactionhistory",
      verifyAuth,
      (req: Request, res: Response) => {
        walletController.getWalletHistory(req, res);
      }
    );
    this.router.post(
      "/client/cancel-request/:bookingId",
      verifyAuth,
      (req: Request, res: Response) => {
        bookingsController.requestCancellation(req, res);
      }
    );
    this.router.post(
      "/client/host-game",
      verifyAuth,
      (req: Request, res: Response) => {
        bookingsController.createGame(req, res);
      }
    );
    this.router.get(
      "/client/get-hosted-game",
      verifyAuth,
      (req: Request, res: Response) => {
        bookingsController.getUpcomingHostedGames(req, res);
      }
    );
    this.router.post(
      "/client/join-hosted-game",
      verifyAuth,
      (req: Request, res: Response) => {
        bookingsController.joinHostedGame(req, res);
      }
    );
    this.router.get(
      "/client/my-chat-groups",
      verifyAuth,
      (req: Request, res: Response) => {
        userController.getMyChatGroup(req, res);
      }
    );
    this.router.get(
      "/client/get-single-hosted-game/:id",
      verifyAuth,
      (req: Request, res: Response) => {
        console.log("heyyyy brooohh");
        bookingsController.getSingleHostedGame(req, res);
      }
    );
    this.router.get(
      "/client/get-chats/:groupId",
      verifyAuth,
      (req: Request, res: Response) => {
        userController.getMessages(req, res);
      }
    );
    this.router.post(
      "/client/add-review",
      verifyAuth,
      (req: Request, res: Response) => {
        turfController.addReview(req, res);
      }
    );
    this.router.post(
      "/client/add-rating",
      verifyAuth,
      (req: Request, res: Response) => {
        turfController.addRating(req, res);
      }
    );
    this.router.get(
      "/client/get-reviews/:turfId",
      verifyAuth,
      (req: Request, res: Response) => {
        turfController.getTurfReviews(req, res);
      }
    );
    this.router.get(
      "/client/get-ratings/:turfId",
      verifyAuth,
      (req: Request, res: Response) => {
        turfController.getTurfRatings(req, res);
      }
    );

    this.router.post(
      "/client/logout",
      verifyAuth,
      (req: Request, res: Response) => {
        authController.logout(req, res);
      }
    );
  }
}
