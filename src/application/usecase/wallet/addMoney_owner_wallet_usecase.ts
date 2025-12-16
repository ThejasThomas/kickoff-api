import { inject, injectable } from "tsyringe";
import { IAddMoneyOwnerWalletUseCase } from "../../../domain/useCaseInterfaces/wallet/add_money_owner_wallet_usecase";
import { IBookingRepository } from "../../../domain/repositoryInterface/booking/booking_repository_interface";
import { IOwnerWalletRepository } from "../../../domain/repositoryInterface/wallet/ownerWalletRepository_interface";
import { IOwnerWalletTransactionRepository } from "../../../domain/repositoryInterface/wallet/owner_wallet_transactionRepository_interface";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { ITurfRepository } from "../../../domain/repositoryInterface/Turf/turf_repository_interface";
import {
  OwnerWalletTransactionStatus,
  OwnerWalletTransactionType,
} from "../../../domain/models/ownerWallet_transaction_entity";
import { Types } from "mongoose";

@injectable()

export class AddMoneyOwnerWalletUseCase implements IAddMoneyOwnerWalletUseCase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("ITurfRepository")
    private _turfRepository: ITurfRepository,
    @inject("IOwnerWalletRepository")
    private _ownerWalletRepository: IOwnerWalletRepository,
    @inject("IOwnerWalletTransactionRepository")
    private _ownerWalletTransactionRepository: IOwnerWalletTransactionRepository
  ) {}

  async execute(bookingId: string): Promise<void> {
    const booking = await this._bookingRepository.findById(bookingId);

    if (!booking) {
      throw new CustomError(
        ERROR_MESSAGES.BOOKING_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const turf = await this._turfRepository.findById(booking.turfId);
    if (!turf) {
      throw new CustomError(
        ERROR_MESSAGES.TURF_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const ownerId = turf.ownerId;

    const wallet = await this._ownerWalletRepository.findByOwnerId(ownerId);
    if (!wallet) {
      await this._ownerWalletRepository.create(ownerId);
    }
console.log('wallettt',wallet)
    await this._ownerWalletRepository.incrementBalance(ownerId, booking.price);
    console.log('incrementttt')

    await this._ownerWalletTransactionRepository.create({
      ownerId,
      turfId: new Types.ObjectId(booking.turfId),
      bookingId: booking._id!,
      amount: booking.price,
      type: OwnerWalletTransactionType.CREDIT,
      reason: "Booking payment credited",
      status: OwnerWalletTransactionStatus.SUCCESS,
      transactionDate: new Date(),
    });
    console.log('heyloooooo')
  }
}
