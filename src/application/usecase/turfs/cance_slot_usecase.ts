import { inject, injectable } from "tsyringe";
import { ICancelSlotUseCase } from "../../../domain/useCaseInterfaces/turfOwner/turfs/cancel_slot_usecase";
import { IBookingRepository } from "../../../domain/repositoryInterface/booking/booking_repository_interface";
import { IHostedGameRepository } from "../../../domain/repositoryInterface/booking/hosted_game_repository_interface";
import { IBlockedSlotRepository } from "../../../domain/repositoryInterface/Turf/blocked_slot_repository_interface";
import { IWalletRepository } from "../../../domain/repositoryInterface/wallet/wallet_repository_interface";
import { ISendEmailUseCase } from "../../../domain/useCaseInterfaces/common/send_email_usecase_interface";
import { IClientRepository } from "../../../domain/repositoryInterface/users/client-repository.interface";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class CancelSlotUseCase implements ICancelSlotUseCase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepo: IBookingRepository,
    @inject("IHostedGameRepository")
    private _hostedGamerepo: IHostedGameRepository,
    @inject("IBlockedSlotRepository")
    private _blockedSlotrepo: IBlockedSlotRepository,
    @inject("IWalletRepository")
    private _walletRepo: IWalletRepository,
    @inject("ISendEmailUseCase")
    private _sendEmailUseCase: ISendEmailUseCase,
    @inject("IClientRepository")
    private _clientrepo: IClientRepository
  ) {}
  async execute(data: {
    turfId: string;
    date: string;
    startTime: string;
    endTime: string;
  }): Promise<void> {
    try {
      const { turfId, date, startTime, endTime } = data;

      const booking = await this._bookingRepo.findSlotBooking(
        turfId,
        date,
        startTime,
        endTime
      );
      if (booking) {
        const user = await this._clientrepo.findbyUserId(booking.userId);
        console.log("user-mail", user?.email);

        if (!user || !user.email) {
          throw new CustomError(
            ERROR_MESSAGES.USER_NOT_FOUND,
            HTTP_STATUS.NOT_FOUND
          );
        }
        await this._walletRepo.addMoney(
          booking.userId,
          booking.price,
          "Slot Cancelled refund"
        );
       

        await this._bookingRepo.updateStatusBookings(
          { _id: (booking as any)._id },
          { status: "cancelled" }
        );

        await this._sendEmailUseCase.execute(
          user.email,
          "Slot Cancelled & Refund Issued",
          `
          <h3>Your Slot Has Been Cancelled</h3>
          <p>Date: ${date}</p>
          <p>Time: ${startTime} - ${endTime}</p>
          <p>Refund Amount: ₹${booking.price}</p>
          <p>The amount has been credited to your wallet.</p>
        `
        );
      }
      const hostedGame = await this._hostedGamerepo.findBySlot(
        turfId,
        date,
        startTime,
        endTime
      );

      if (hostedGame) {
        for (const player of hostedGame.players || []) {
          const user = await this._clientrepo.findbyUserId(player.userId);
          if (!user || !user.email) continue;
          await this._walletRepo.addMoney(
            player.userId,
            hostedGame.pricePerPlayer,
            "Hosted game cancelled refund"
          );
          console.log('userrrrrrEmmail',user.email)
          await this._sendEmailUseCase.execute(
            user.email,
            "Hosted Game Cancelled",
            `
        <h3>Your Hosted Game Was Cancelled</h3>
        <p>Date: ${date}</p>
        <p>Time: ${startTime} - ${endTime}</p>
        <p>Refund Amount: ₹${hostedGame.pricePerPlayer}</p>
        <p>The refund has been credited to your wallet.</p>
      `
          );
        }
        console.log('hosteddId',hostedGame._id)
        await this._hostedGamerepo.update(
          { _id: hostedGame._id },
          { 
            status: "cancelled",
            players:[]
           }
        );
      }
      await this._blockedSlotrepo.create({
        turfId,
        date,
        startTime,
        endTime,
        reason: "Owner cancelled slot",
      });
    } catch (error: unknown) {
      console.error(error);
      return;
    }
  }
}
