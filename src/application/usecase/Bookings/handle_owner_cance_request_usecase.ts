import { inject, injectable } from "tsyringe";
import { ICancelRequestRepository } from "../../../domain/repositoryInterface/booking/cancel_request_repository";
import { IBookingRepository } from "../../../domain/repositoryInterface/booking/booking_repository_interface";
import { IClientRepository } from "../../../domain/repositoryInterface/users/client-repository.interface";
import { IWalletRepository } from "../../../domain/repositoryInterface/wallet/wallet_repository_interface";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IHandlOwnerCancelRequestUseCase } from "../../../domain/useCaseInterfaces/Bookings/handle_owner_cancel_request_usecase_interface";

@injectable()
export class HandleOwnerCancelrequestUseCase implements IHandlOwnerCancelRequestUseCase{
    constructor(
        @inject("ICancelRequestRepository")
        private _cancelRequestRepo:ICancelRequestRepository,
        @inject("IBookingRepository")
        private _bookingrepo:IBookingRepository,
        @inject("IWalletRepository")
        private _walletRepository:IWalletRepository
    ){}

    async execute(requestId: string, action: "approved" | "rejected"): Promise<{ message: string; }> {
        const request =await this._cancelRequestRepo.findById(requestId)
        console.log('reqqqqqqqq',request)
        if(!request){
            throw new CustomError(
                ERROR_MESSAGES.REQUEST_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        const booking= await this._bookingrepo.findById(request.bookingId)
        if(!booking){
            throw new CustomError(
                ERROR_MESSAGES.BOOKING_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }
        if(action==="rejected"){
            await this._bookingrepo.updateStatus(requestId,"rejected")
            await this._bookingrepo.updateStatusById(request.bookingId,"confirmed")
            return {message:"Cancellation rejected successfully"}
        }
        
        if(action ==="approved"){
            await this._walletRepository.addMoney(
                booking.userId,
                booking.price,
                "Cancellation refund"
            )
             
            await this._bookingrepo.updateStatus(requestId,"approved");

            await this._bookingrepo.updateStatusById(request.bookingId,"cancelled");

            
            return {message:"Cancellation approved & refund issued"}

        }
        throw new CustomError(
            ERROR_MESSAGES.INVALID_ACTION,
            HTTP_STATUS.BAD_REQUEST
        )

    }

    
}