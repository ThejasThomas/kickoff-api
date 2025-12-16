import { inject, injectable } from "tsyringe";
import { ICancelRequestRepository } from "../../../domain/repositoryInterface/booking/cancel_request_repository";
import { IBookingRepository } from "../../../domain/repositoryInterface/booking/booking_repository_interface";
import { IClientRepository } from "../../../domain/repositoryInterface/users/client-repository.interface";
import { IWalletRepository } from "../../../domain/repositoryInterface/wallet/wallet_repository_interface";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IHandlOwnerCancelRequestUseCase } from "../../../domain/useCaseInterfaces/Bookings/handle_owner_cancel_request_usecase_interface";
import { IEmailService } from "../../../domain/serviceInterfaces/email_service_interface";
import { IOwnerWalletRepository } from "../../../domain/repositoryInterface/wallet/ownerWalletRepository_interface";
import { IOwnerWalletTransactionRepository } from "../../../domain/repositoryInterface/wallet/owner_wallet_transactionRepository_interface";
import { ITurfRepository } from "../../../domain/repositoryInterface/Turf/turf_repository_interface";
import { Types } from "mongoose";
import { OwnerWalletTransactionStatus, OwnerWalletTransactionType } from "../../../domain/models/ownerWallet_transaction_entity";

@injectable()
export class HandleOwnerCancelrequestUseCase
  implements IHandlOwnerCancelRequestUseCase
{
  constructor(
    @inject("ICancelRequestRepository")
    private _cancelRequestRepo: ICancelRequestRepository,
    @inject("IBookingRepository")
    private _bookingrepo: IBookingRepository,
    @inject("IWalletRepository")
    private _walletRepository: IWalletRepository,
    @inject("IEmailService")
    private _emailService: IEmailService,
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,
    @inject("IOwnerWalletRepository")
    private _ownerWalletRepository:IOwnerWalletRepository,
    @inject("IOwnerWalletTransactionRepository")
    private _ownerWalletTransactionRepository:IOwnerWalletTransactionRepository,
    @inject("ITurfRepository")
    private _turfrepository:ITurfRepository
  ) {}

  async execute(
    requestId: string,
    action: "approved" | "rejected",
    userId: string
  ): Promise<{ message: string }> {
    const request = await this._cancelRequestRepo.findById(requestId);
    console.log("reqqqqqqqq", request);
    if (!request) {
      throw new CustomError(
        ERROR_MESSAGES.REQUEST_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const booking = await this._bookingrepo.findById(request.bookingId);

    console.log("bookings", booking);
    if (!booking) {
      throw new CustomError(
        ERROR_MESSAGES.BOOKING_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const user = await this._clientRepository.findbyUserId(userId);
    console.log("userr", user);
    if (!user.email) {
      throw new CustomError(
        ERROR_MESSAGES.EMAIL_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    console.log('actionn',action)
    if (action === "rejected") {
      await this._bookingrepo.updateStatus(requestId, "rejected");
      await this._bookingrepo.updateStatusById(request.bookingId, "confirmed");

      await this._emailService.sendRejectionEmail(
        user.email,
        "Your cancellation request was rejected by turf owner.",
        "https://kickoffff.com/my-bookingssss",
        "Booking Cancellation"
      );
      return { message: "Cancellation rejected successfully" };
    }
    console.log('booking.turfid',booking.turfId)
    if (action === "approved") {
      console.log('id',booking.userId)
      console.log('price',booking.price)
      await this._walletRepository.addMoney(
        booking.userId,
        booking.price,
        "Cancellation refund"
      );
      console.log('bruuh moneyy added ')
      const turf=await this._turfrepository.findById(booking.turfId)

      console.log('turffffIDDDDDDD',turf)

      if(!turf){
        throw new CustomError(
          ERROR_MESSAGES.TURF_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        )
      }

      const ownerId =turf.ownerId;
      console.log('iddOwnerrrrr',ownerId)

      await this._ownerWalletRepository.decrementBalance(
        ownerId,
        booking.price
      )
       await this._ownerWalletTransactionRepository.create({
        ownerId,
        turfId: new Types.ObjectId(booking.turfId),
        bookingId: booking._id!,
        amount: booking.price,
        type: OwnerWalletTransactionType.DEBIT,
        reason: "Booking cancellation refund",
        status: OwnerWalletTransactionStatus.SUCCESS,
        transactionDate: new Date(),
      });

      await this._bookingrepo.updateStatus(requestId, "approved");

      await this._bookingrepo.updateStatusById(request.bookingId, "cancelled");

      await this._emailService.sendApprovalEmail(
        user.email,
        "Booking Cancellation Refund"
      );

      return { message: "Cancellation approved & refund issued" };
    }
    throw new CustomError(
      ERROR_MESSAGES.INVALID_ACTION,
      HTTP_STATUS.BAD_REQUEST
    );
  }
}
