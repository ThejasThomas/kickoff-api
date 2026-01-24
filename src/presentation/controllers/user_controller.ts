import { inject, injectable } from "tsyringe";
import { IUserController } from "../../domain/controllerInterfaces/users/user-controller.interface";
import { IGetAllUsersUseCase } from "../../domain/useCaseInterfaces/users/get_all_users_usecase_interface";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../shared/constants";
import { handleErrorResponse } from "../../shared/utils/error_handler";
import { Request, Response } from "express";
import { IUpdateEntityStatusUseCase } from "../../domain/useCaseInterfaces/users/update_entity_status_usecase_interface";
import { CustomRequest } from "../middlewares/auth_middleware";
import { IGetBookedUsersDetails } from "../../domain/useCaseInterfaces/users/get_bookedUsersDetails_interface";
import { IGetUserDetailsUseCase } from "../../domain/useCaseInterfaces/users/get_user_details_usecase_interface";
import { IUpdateUserDetailsUseCase } from "../../domain/useCaseInterfaces/users/update_userdetails_usecase_interface";
import { CustomError } from "../../domain/utils/custom.error";
import Stripe from "stripe";
import { HostedGameModel } from "../../interfaceAdapters/database/mongoDb/schemas/hosted_game_schema";
import { IGetUserChatGroupsUseCase } from "../../domain/useCaseInterfaces/users/get_user_caht_group_interface";
import { IGetChatMessageUseCase } from "../../domain/useCaseInterfaces/messages/getChatMessageUsecase_interface";
import { IGetChatPageDataUseCase } from "../../domain/useCaseInterfaces/messages/getChatPageData_usecase";
import { IBookSlotUseCase } from "../../domain/useCaseInterfaces/Bookings/book_slot_useCase_interface";
import { IBookingEntity } from "../../domain/models/booking_entity";
import { CreateBookingInput } from "../../application/usecase/Bookings/book_slot_usecase";

@injectable()
export class UserController implements IUserController {
  private stripe: Stripe;

  constructor(
    @inject("IGetAllUsersUseCase")
    private _getAllUsersUseCase: IGetAllUsersUseCase,
    @inject("IUpdateEntityStatusUseCase")
    private __updateEntityStatusUseCase: IUpdateEntityStatusUseCase,
    @inject("IGetBookedUsersDetails")
    private _getBookedUserDetailsUseCase: IGetBookedUsersDetails,
    @inject("IGetUserDetailsUseCase")
    private _getUserDetailsUseCase: IGetUserDetailsUseCase,
    @inject("IUpdateUserDetailsUseCase")
    private _updateUserDetailsUseCase: IUpdateUserDetailsUseCase,
    @inject("IGetUserChatGroupsUseCase")
    private _getUserChatGroupsUseCase: IGetUserChatGroupsUseCase,
    @inject("IGetChatMessageUseCase")
    private _getChatMessageUseCase: IGetChatMessageUseCase,
    @inject("IGetChatPageDataUseCase")
    private _getChatPageDataUseCase: IGetChatPageDataUseCase,
    @inject("IBookSlotUseCase")
    private _bookSlotUseCase: IBookSlotUseCase,
  ) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async refreshSession(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as CustomRequest).user;
      if (!user?.userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_TOKEN,
        });
        return;
      }
      res.status(HTTP_STATUS.OK).json({
        success: true,
        user,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 4, search = "", role, status } = req.query;
      const excludeStatus =
        req.query["excludeStatus[]"] || req.query.excludeStatus;

      const pageNumber = Math.max(Number(page), 1);
      const pageSize = Math.max(Number(limit), 1);
      const searchTerm = typeof search === "string" ? search : "";

      let excludeStatusArr: string[] = [];
      if (typeof excludeStatus === "string") {
        excludeStatusArr = [excludeStatus];
      } else if (Array.isArray(excludeStatus)) {
        excludeStatusArr = excludeStatus.map(String);
      }

      const roleStr = role === "turfOwner" ? "turfOwner" : "client";

      const { users, totalPages } = await this._getAllUsersUseCase.execute(
        roleStr,
        pageNumber,
        pageSize,
        searchTerm,
        status as string,
        excludeStatusArr,
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        users,
        totalPages,
        currentPage: pageNumber,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  async getUserDetails(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user?.userId;
      const userDetails = await this._getUserDetailsUseCase.execute(userId);
      res.status(HTTP_STATUS.OK).json(userDetails);
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  async updateUserDetails(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user?.userId;
      const profileDate = req.body;
      if (!userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        });
        return;
      }
      const updatedProfile = await this._updateUserDetailsUseCase.execute(
        userId,
        profileDate,
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.PROFILE_UPDATED_SUCCESSFULLY,
        data: updatedProfile,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        handleErrorResponse(req, res, error);
      }
    }
  }

  async updateEntityStatus(req: Request, res: Response): Promise<void> {
    try {
      const { entityType, entityId, status, reason, email } = req.body;
      const ownerId = req.body.ownerId;
      await this.__updateEntityStatusUseCase.execute(
        entityType,
        entityId,
        status,
        reason,
        email,
        ownerId,
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.UPDATED,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
  async getBookedUserDetails(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        });
      }
      const userDetails =
        await this._getBookedUserDetailsUseCase.execute(userId);
      res.status(HTTP_STATUS.OK).json(userDetails);
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
  async stripePaymentSession(req: Request, res: Response): Promise<void> {
    try {
      const { amount, bookingData } = req.body;

      if (!amount || amount <= 0) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        });
        return;
      }
      const frontendUrl = process.env.FRONTEND_URL;
      if (!frontendUrl) {
        console.error("Missing FRONTEND_URL env var");
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Server config error: Missing frontend URL",
        });
        return;
      }
      let fullFrontendUrl = frontendUrl;
      if (
        !fullFrontendUrl.startsWith("http://") &&
        !fullFrontendUrl.startsWith("https://")
      ) {
        fullFrontendUrl = `http://${fullFrontendUrl}`;
      }
      const essentialMetadata = {
        turfId: bookingData.turfId,
        date: bookingData.date,
        totalAmount: amount.toString(),
      };
      const encodedBookingData = encodeURIComponent(
        JSON.stringify(bookingData),
      );
      const successUrl = `${fullFrontendUrl}/paymentpage?status=success&session_id={CHECKOUT_SESSION_ID}&bookingData=${encodedBookingData}`;
      const cancelUrl = `${fullFrontendUrl}/paymentpage?status=cancelled`;

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: "Turf Booking",
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        mode: "payment",
        metadata: essentialMetadata,
      });
      console.log("SESSION URL=", session.url);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        url: session.url,
      });
    } catch (error) {
      console.error("Stripe session creation error", error);
      handleErrorResponse(req, res, error);
    }
  }
  async verifyPaymentSession(req: Request, res: Response): Promise<void> {
    try {
      console.log("broo heyloooo are u finee??");
      const { id: sessionId } = req.params;
      if (!sessionId) {
        res.status(400).json({ success: false, message: "Missing session ID" });
        return;
      }
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== "paid") {
        res.status(400).json({ success: false, message: "Payment not paid" });
        return;
      }

      res.status(200).json({ success: true });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
  async createWalletCheckoutSession(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        res.status(400).json({
          success: false,
          message: "Invalid wallet top-up amount",
        });
      }

      let frontendUrl = process.env.FRONTEND_URL!;
      if (!frontendUrl.startsWith("http")) {
        frontendUrl = `http://${frontendUrl}`;
      }

      const metadata = {
        purpose: "wallet_topup",
        amount: amount.toString(),
      };

      const successUrl = `${frontendUrl}/wallet?success=true&amount=${amount}`;

      const cancelUrl = `${frontendUrl}/wallet?success=false`;

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: { name: "Wallet Top-Up" },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata,
      });

      res.status(200).json({
        success: true,
        url: session.url,
      });
    } catch (err) {
      console.error("Wallet checkout session error:", err);
      res.status(500).json({
        success: false,
        message: "Failed to start wallet payment",
      });
    }
  }
  async createHostedGameCheckoutSession(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const {
        turfId,
        slotId,
        slotDate,
        startTime,
        endTime,
        courtType,
        pricePerPlayer,
      } = req.body;
      console.log("heyyyyyy broohh");

      if (
        !turfId ||
        !slotId ||
        !slotDate ||
        !startTime ||
        !endTime ||
        !courtType ||
        !pricePerPlayer
      ) {
        res.status(400).json({
          success: false,
          message: "Missing required game hosting details",
        });
        return;
      }

      let frontendUrl = process.env.FRONTEND_URL!;
      if (!frontendUrl.startsWith("http")) {
        frontendUrl = `http://${frontendUrl}`;
      }

      const metadata = {
        purpose: "host_game",
        turfId,
        slotId,
        slotDate,
        startTime,
        endTime,
        courtType,
        pricePerPlayer: pricePerPlayer.toString(),
      };

      // const encodedGameData = encodeURIComponent(JSON.stringify(metadata));

      const successUrl = `${frontendUrl}/host-game-payment?status=success&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${frontendUrl}/host-game-payment?status=cancelled`;

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        metadata,
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: { name: `Host Game (${courtType})` },
              unit_amount: pricePerPlayer * 100,
            },
            quantity: 1,
          },
        ],
        success_url: successUrl.replace(
          "{CHECKOUT_SESSION_ID}",
          "{CHECKOUT_SESSION_ID}",
        ),
        cancel_url: cancelUrl,
      });

      res.status(200).json({
        success: true,
        url: session.url,
      });
    } catch (err) {
      console.error("Hosted game checkout session error:", err);
      res.status(500).json({
        success: false,
        message: "Failed to start hosted game payment",
      });
    }
  }
async verifyBookingPayment(req: Request, res: Response): Promise<void> {
    try {
      const sessionId = req.params.sessionId;

      const session = await this.stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status !== "paid") {
        res.status(400).json({ success: false, message: "Payment not paid" });
        return;
      }

      const metadata = session.metadata as any;
      const { turfId, date, slotDetails, userId } = metadata;

      if (!turfId || !date || !slotDetails || !userId) {
        res.status(400).json({ success: false, message: "Invalid metadata" });
        return;
      }

      let parsedSlots: Array<{
        startTime: string;
        endTime: string;
        price: string;
      }>;
      try {
        parsedSlots = JSON.parse(slotDetails);
      } catch (err) {
        res.status(400).json({
          success: false,
          message: "Invalid slot details format",
        });
        return;
      }

      for (const slot of parsedSlots) {
        const bookingData: CreateBookingInput = {
          turfId,
          date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          price: parseFloat(slot.price),
          status: "confirmed",
          paymentMethod: "stripe",
          paymentStatus: "completed",
          paymentId: sessionId,
          adminCommissionProcessed: false,
        };

        await this._bookSlotUseCase.execute(bookingData, userId);
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error verifying Stripe booking payment:", error);
      handleErrorResponse(req, res, error);
    }
  }





  async createJoinHostedGameCheckoutSession(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { gameId } = req.body;

      if (!gameId) {
        res.status(400).json({
          success: false,
          message: "Game ID is required",
        });
        return;
      }

      const game = await HostedGameModel.findById(gameId);

      if (!game) {
        res.status(404).json({
          success: false,
          message: "Hosted game not found",
        });
        return;
      }

      let frontendUrl = process.env.FRONTEND_URL!;
      if (!frontendUrl.startsWith("http")) {
        frontendUrl = `http://${frontendUrl}`;
      }

      const metadata = {
        purpose: "join_game",
        gameId: game._id.toString(),
        turfId: game.turfId,
        slotDate: game.slotDate,
        startTime: game.startTime,
        endTime: game.endTime,
        pricePerPlayer: game.pricePerPlayer.toString(),
      };

      const successUrl = `${frontendUrl}/hosted-games/join-hosted-game/${game._id}?status=success&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${frontendUrl}/hosted-games/join-hosted-game/${game._id}?status=cancelled`;

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        metadata,

        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: `Join Game (${game.courtType})`,
                description: `${game.slotDate} | ${game.startTime} - ${game.endTime}`,
              },
              unit_amount: Math.round(game.pricePerPlayer * 100),
            },
            quantity: 1,
          },
        ],

        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      res.status(200).json({
        success: true,
        url: session.url,
      });
    } catch (err) {
      console.error("Join hosted game checkout error:", err);
      res.status(500).json({
        success: false,
        message: "Failed to start join game payment",
      });
    }
  }

  async getMyChatGroup(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user?.userId;
      console.log("userrIDDD", userId);

      if (!userId) {
        res.status(401).json({ success: false });
        return;
      }
      const groups = await this._getUserChatGroupsUseCase.execute(userId);

      console.log("groupsss", groups);

      res.status(200).json({
        success: true,
        groups,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
  async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const { groupId } = req.params;

      const data = await this._getChatPageDataUseCase.execute(groupId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        group: data.group,
        messages: data.messages,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
}
