import { inject, injectable } from "tsyringe";
import { IBookingsController } from "../../domain/controllerInterfaces/bookings/bookings_controller_interface";
import { Request, Response } from "express";
import { CustomError } from "../../domain/utils/custom.error";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../shared/constants";
import { IGetBookingsUseCase } from "../../domain/useCaseInterfaces/Bookings/get_bookings_useCase_interface";
import { GetBookingDTO } from "../../application/dtos/booking_dto";
import { CustomRequest } from "../middlewares/auth_middleware";
import { IGetUpcomingBookingUseCase } from "../../domain/useCaseInterfaces/Bookings/get_upcoming_bookings_usecase_interface";
import { IGetBookedTurfUseCase } from "../../domain/useCaseInterfaces/Bookings/get_booked_useCase_interface";
import { IGetPastBookingsUseCase } from "../../domain/useCaseInterfaces/Bookings/get_pastbookings_usecase_interface";
import { IRequestCancelBookingUseCase } from "../../domain/useCaseInterfaces/Bookings/cancel_booking_usecase";
import { IHandlOwnerCancelRequestUseCase } from "../../domain/useCaseInterfaces/Bookings/handle_owner_cancel_request_usecase_interface";
import { IGetCancelRequestsUseCase } from "../../domain/useCaseInterfaces/Bookings/get_cancel_booking_requests_interface";
import { ICreateHostedGameUseCase } from "../../domain/useCaseInterfaces/Bookings/create_hosted_game_usecase_interface";
import { IGetUpcomingHostedGamesUseCase } from "../../domain/useCaseInterfaces/Bookings/get_upcoming_hostedGame_useCase";
import { IJoinHostedGameUseCase } from "../../domain/useCaseInterfaces/Bookings/join_hostedGame_usecase_interface";
import { IGetSingleHostedGameUseCase } from "../../domain/useCaseInterfaces/Bookings/getSingleHostedGameUseCase_interface";
import { IHoldSlotUseCase } from "../../domain/useCaseInterfaces/Bookings/hold_slot_usecase_interface";
import { IGetUpcomingHostedGamesByUserUseCase } from "../../domain/useCaseInterfaces/Bookings/get_upcoming_hosted_game_usecase_interface";
import { IRequestHostedGameCancelUseCase } from "../../domain/useCaseInterfaces/Bookings/cancel_hosted_game_usecase_interface";
import { IReleaseSlotUsecase } from "../../domain/useCaseInterfaces/Bookings/release_slot_usecase_interface";
import { IHostedGameRepository } from "../../domain/repositoryInterface/booking/hosted_game_repository_interface";
import { handleErrorResponse } from "../../shared/utils/error_handler";
import Stripe from "stripe";

@injectable()
export class BookingsController implements IBookingsController {
  constructor(
    @inject("IGetBookingsUseCase")
    private _getBookingsUseCase: IGetBookingsUseCase,
    @inject("IGetUpcomingBookingUseCase")
    private _getUpcomingBookingsUseCase: IGetUpcomingBookingUseCase,
    @inject("IGetBookedTurfUseCase")
    private _getBookedTurfUseCase: IGetBookedTurfUseCase,
    @inject("IGetPastBookingsUseCase")
    private _getPastBookingsUseCase: IGetPastBookingsUseCase,
    @inject("IRequestCancelBookingUseCase")
    private _requestCancelBookingUseCase: IRequestCancelBookingUseCase,
    @inject("IHandlOwnerCancelRequestUseCase")
    private _handleOwnerCancelUseCase: IHandlOwnerCancelRequestUseCase,
    @inject("IGetCancelRequestsUseCase")
    private _getCancellBookingsUseCase: IGetCancelRequestsUseCase,
    @inject("ICreateHostedGameUseCase")
    private _createHostedGameUseCase: ICreateHostedGameUseCase,
    @inject("IGetUpcomingHostedGamesUseCase")
    private _getUpcomingHostedGamesUseCase: IGetUpcomingHostedGamesUseCase,
    @inject("IJoinHostedGameUseCase")
    private _joinHostedGameUsecase: IJoinHostedGameUseCase,
    @inject("IGetSingleHostedGameUseCase")
    private _getSingleHostedGameUseCase: IGetSingleHostedGameUseCase,
    @inject("IHoldSlotUseCase")
    private _holdSlotUseCase: IHoldSlotUseCase,
    @inject("IGetUpcomingHostedGamesByUserUseCase")
    private _getUpcomingHostedGamesByUser: IGetUpcomingHostedGamesByUserUseCase,
    @inject("IRequestHostedGameCancelUseCase")
    private _requesthostedGameCancellationUseCase: IRequestHostedGameCancelUseCase,
    @inject("IReleaseSlotUsecase")
    private _releaseSlotUsecase:IReleaseSlotUsecase,
    @inject("IHostedGameRepository")
    private _hostedGameRepo:IHostedGameRepository,
    @inject("Stripe")
    private stripe:Stripe
  ) {}
  async getAllbookings(req: Request, res: Response): Promise<void> {
    try {
      const { turfId, date } = req.query as unknown as GetBookingDTO;

      if (typeof turfId !== "string" || typeof date !== "string") {
        throw new CustomError(
          ERROR_MESSAGES.INVALID_TURFID_OR_DATE,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const bookings = await this._getBookingsUseCase.execute(turfId, date);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.BOOKINGS_FETCHED_SUCCESSFULLY,
        bookings,
      });
    } catch (error) {
      console.error("Error in getAllbookings", error);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          bookings: [],
        });
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "failed to fetch bookings",
          bookings: [],
        });
      }
    }
  }
  async getUpcomingbookings(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user?.userId;
      const { page = 1, limit = 10, search = "" } = req.query;
      console.log("boookinguserIddd", userId);

      const pageNumber = Math.max(Number(page), 1);
      const pageSize = Math.max(Number(limit), 1);
      const searchTerm = typeof search === "string" ? search : "";

      if (!userId) {
        throw new CustomError(
          ERROR_MESSAGES.USER_NOT_FOUND,
          HTTP_STATUS.UNAUTHORIZED
        );
      }
      const { bookings, totalPages, total } =
        await this._getUpcomingBookingsUseCase.execute(
          userId,
          pageNumber,
          pageSize,
          searchTerm
        );
      console.log("bookingssss", bookings);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.BOOKINGS_FETCHED_SUCCESSFULLY,
        bookings,
        totalPages,
        total,
        currentPage: pageNumber,
      });
    } catch (error) {
      console.error("Error in upcoming bookings", error);

      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          bookings: [],
        });
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to fetch upcoming bookings",
          bookings: [],
        });
      }
    }
  }


  async getPastbookings(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user?.userId;

      const page =Number(req.query.page)|| 1;
      const limit =Number(req.query.limit) || 4;


      if (!userId) {
        throw new CustomError(
          ERROR_MESSAGES.USER_NOT_FOUND,
          HTTP_STATUS.UNAUTHORIZED
        );
      }
      const bookings = await this._getPastBookingsUseCase.execute(userId,page,limit);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.BOOKINGS_FETCHED_SUCCESSFULLY,
        ...bookings,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          bookings: [],
        });
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to fetch past bookings",
          bookings: [],
        });
      }
    }
  }

  async getTurfdetails(req: Request, res: Response): Promise<void> {
    try {
      const { turfId } = req.query;

      if (typeof turfId !== "string") {
        throw new CustomError(
          ERROR_MESSAGES.INVALID_CREDENTIALS,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const turfDetails = await this._getBookedTurfUseCase.execute(turfId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.TURF_DETAILS_FETCHED_SUCCESSFULLY,
        turfDetails,
      });
    } catch (error) {
      console.error("Error in getTurfdetails", error);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          turfDetails: null,
        });
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to fetch turf details",
          turfDetails: null,
        });
      }
    }
  }
  async requestCancellation(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user?.userId;
      const bookingId = req.params.bookingId;
      const { reason } = req.body;
      console.log("userIdd", userId + "    ", "bookingIs", bookingId);
      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }
      if (!reason) {
        res.status(400).json({
          success: false,
          message: "Cancellation reason is required",
        });
      }

      const result = await this._requestCancelBookingUseCase.execute(
        userId,
        bookingId,
        reason
      );

      res.status(200).json({
        success: true,
        message: "Cancellation request submitted successfully",
        data: result,
      });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode || 400).json({
          success: false,
          message: err.message,
        });
      }
    }
  }

  async handleOwnerCancelRequest(req: Request, res: Response): Promise<void> {
    try {
      const ownerId = (req as CustomRequest).user?.userId;
      const { requestId, userId } = req.params;
      const { action } = req.body;
      console.log("userrrIddddd", ownerId);

      if (!ownerId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.USER_NOT_FOUND,
        });
        return;
      }
      if (!requestId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.REQUEST_ID_REQUIRED,
        });
        return;
      }
      if (!["approved", "rejected"].includes(action)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_ACTION,
        });
        return;
      }
      const result = await this._handleOwnerCancelUseCase.execute(
        requestId,
        action,
        userId
      );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          messsage: error.message,
        });
        return;
      }
    }
  }
  async getCancelRequestBookings(req: Request, res: Response): Promise<void> {
    try {
      const ownerId = (req as CustomRequest).user?.userId;
      const page=Number(req.query.page)|| 1;
      const limit=Number(req.query.limit) ||4;

      if (!ownerId) {
        throw new CustomError(
          ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
          HTTP_STATUS.UNAUTHORIZED
        );
        return;
      }
      const requests = await this._getCancellBookingsUseCase.execute(ownerId,page,limit);
      console.log("requesttss", requests);

      res.status(200).json({
        success: true,
        message: "Cancellation requests fetched successfully",
        ...requests,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Failed to fetch cancellation requests",
      });
    }
  }

  async createGame(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user?.userId;
      const {
        turfId,
        courtType,
        slotDate,
        startTime,
        endTime,
        pricePerPlayer,
      } = req.body;
      if (!turfId || !courtType || !slotDate || !startTime || !endTime || pricePerPlayer <= 0) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "Invalid game data" });
      return;
    }

      const result = await this._createHostedGameUseCase.execute({
        hostUserId: userId,
        turfId,
        courtType,
        slotDate,
        startTime,
        endTime,
        pricePerPlayer,
      });
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: "Game Hosted Successfully",
        game: result,
      });
    } catch (err: any) {
      if (err instanceof CustomError) {
      res.status(err.statusCode).json({ success: false, message: err.message });
    } else {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || "Failed to Host game",
      });
    }
    }
  }
 async verifyGamePayment(req: Request, res: Response): Promise<void> {
  try {
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

    const metadata = session.metadata || {};
    if (typeof metadata !== 'object') {
      res.status(400).json({ success: false, message: "Invalid session metadata" });
      return;
    }

    const { turfId, slotDate, startTime, endTime, courtType, pricePerPlayer, hostUserId, slotId } = metadata as Record<string, string>;
    if (!turfId || !hostUserId || !slotDate) {
      res.status(400).json({ success: false, message: "Invalid session metadata" });
      return;
    }

    const game = await this._createHostedGameUseCase.execute({
      hostUserId,
      turfId,
      courtType,
      slotDate,
      startTime,
      endTime,
      pricePerPlayer: parseFloat(pricePerPlayer || "0"),
      sessionId,
    });

    await this._hostedGameRepo.updatePlayerStatus(game._id!.toString(), hostUserId, {
      status: "paid",
      paymentId: sessionId,
    });

    res.status(200).json({ success: true, gameId: game._id });
  } catch (error) {
    console.error("Game payment verification error:", error);
    handleErrorResponse(req, res, error);
  }
}
  async createGamePaymentSession(req: Request, res: Response): Promise<void> {
    try {
      const { amount, gameData } = req.body;

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
      if (!fullFrontendUrl.startsWith("http://") && !fullFrontendUrl.startsWith("https://")) {
        fullFrontendUrl = `http://${fullFrontendUrl}`;
      }

      const encodedGameData = encodeURIComponent(JSON.stringify(gameData));

      const essentialMetadata = {
        turfId: gameData.turfId,
        slotDate: gameData.slotDate,
        startTime: gameData.startTime,
        endTime: gameData.endTime,
        courtType: gameData.courtType,
        pricePerPlayer: gameData.pricePerPlayer.toString(),
        hostUserId: (req as CustomRequest).user?.userId,
        slotId: gameData.slotId || "",
      };

      const successUrl = `${fullFrontendUrl}/host-game-payment?status=success&session_id={CHECKOUT_SESSION_ID}&gameData=${encodedGameData}`;
      const cancelUrl = `${fullFrontendUrl}/host-game-payment?status=cancelled`;

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: `Host Game - ${gameData.courtType} at ${gameData.turfId}`,
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

      console.log("Game SESSION URL=", session.url);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        url: session.url,
      });
    } catch (error) {
      console.error("Game Stripe session creation error", error);
      handleErrorResponse(req, res, error);
    }
  }

 async createTurfPaymentSession(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { turfId, date, slotDetails, totalAmount } = req.body;

    if (!turfId || !date || !slotDetails?.length || !totalAmount) {
      res.status(400).json({
        success: false,
        message: "Invalid booking data",
      });
      return;
    }

    let frontendUrl = process.env.FRONTEND_URL!;
    if (!frontendUrl.startsWith("http")) {
      frontendUrl = `http://${frontendUrl}`;
    }

    const userId = (req as CustomRequest).user.userId;

    const encodedBookingData = encodeURIComponent(
      JSON.stringify({ turfId, date, slotDetails, totalAmount })
    );

    console.log("🔧 Creating Turf Payment Session");
    console.log("  Frontend URL:", frontendUrl);

    const session = await this.stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Turf Booking",
            },
            unit_amount: Math.round(totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        turfId,
        date,
        slotDetails: JSON.stringify(slotDetails),
        userId,
      },
      success_url: `${frontendUrl}/paymentpage?status=success&session_id={CHECKOUT_SESSION_ID}&bookingData=${encodedBookingData}`,
      cancel_url: `${frontendUrl}/paymentpage?status=cancelled`,
    });

    console.log("✅ Session created:", session.id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("❌ Stripe session error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment session",
    });
  }
}
  async getUpcomingHostedGames(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = "1",
        limit = "6",
        search = "",
        minPrice,
        maxPrice,
      } = req.query;

      const games = await this._getUpcomingHostedGamesUseCase.execute({
        page: Number(page),
        limit: Number(limit),
        search: search as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      });
      res.status(200).json({
        success: true,
        games,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Failed to fetch upcoming hosted games",
      });
    }
  }
  async joinHostedGame(req: Request, res: Response): Promise<void> {
    try {
      const { gameId } = req.body;
      const userId = (req as CustomRequest).user?.userId;

      if (!gameId || !userId) {
        res.status(400).json({
          success: false,
          message: "Game ID and user ID required",
        });
        return;
      }

      const result = await this._joinHostedGameUsecase.execute({
        gameId,
        userId,
      });
      res.status(200).json(result);
    } catch (err: any) {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Failed to join game",
      });
    }
  }
  async getSingleHostedGame(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      console.log("idddd", id);

      const game = await this._getSingleHostedGameUseCase.execute(id);

      res.status(200).json({
        success: true,
        game,
      });
    } catch (err: any) {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Failed to fetch hosted game",
      });
    }
  }
  async holdSlot(req: Request, res: Response): Promise<void> {
    try {
      const { turfId, date, startTime, endTime } = req.body;
      const userId = (req as CustomRequest).user?.userId;
      console.log("dataas", userId, date, startTime, endTime);

      await this._holdSlotUseCase.execute(
        turfId,
        date,
        startTime,
        endTime,
        userId
      );
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Slot locked successfully",
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  }
  async getUpcomingHostedGamesByUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const userId = (req as CustomRequest).user?.userId;
      const { page = 1, limit = 10, search = "" } = req.query;

      if (!userId) {
        throw new CustomError(
          ERROR_MESSAGES.USER_NOT_FOUND,
          HTTP_STATUS.UNAUTHORIZED
        );
      }
      const result = await this._getUpcomingHostedGamesByUser.execute(
        userId,
        Number(page),
        Number(limit),
        String(search)
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.HOSTED_GAME_FETCHED_SUCCESSFULLY,
        ...result,
        currentPage: Number(page),
      });
    } catch (error) {
      res
        .status(
          error instanceof CustomError
            ? error.statusCode
            : HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
        .json({
          success: false,
          message:
            error instanceof CustomError ? error.message : ERROR_MESSAGES,
          games: [],
        });
    }
  }

  async requestHostedGameCancellation(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const userId = (req as CustomRequest).user?.userId;
      const hostedGameId = req.params.gameId;
      const { reason } = req.body;
      console.log('reason',reason)

      if (!userId) {
        res
          .status(401)
          .json({
            success: false,
            message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
          });
        return;
      }
      if (!reason) {
        res.status(400).json({
          success: false,
          message: ERROR_MESSAGES.CANCELLATION_REASON_REQUIRED,
        });
        return;
      }
      const result = await this._requesthostedGameCancellationUseCase.execute(
        userId,
        hostedGameId,
        reason
      );

      res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.HOSTES_GAME_CANCELLATION_REQUESTED,
        data: result,
      });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }
    }
  }
   async releaseSlot(req: Request, res: Response): Promise<void> {
    try{
      const {turfId,date,startTime,endTime}=req.body;
      const userId =(req as CustomRequest).user?.userId;

      await this._releaseSlotUsecase.execute(
        turfId,
        date,
        startTime,
        endTime,
        userId
      )

      res.status(200).json({success:true})

    }catch(error){
      console.log(error)
      res.status(500).json({success:true})
    }
  }
}
