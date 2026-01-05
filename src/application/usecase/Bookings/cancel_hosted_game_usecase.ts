import { inject, injectable } from "tsyringe";
import { IRequestHostedGameCancelUseCase } from "../../../domain/useCaseInterfaces/Bookings/cancel_hosted_game_usecase_interface";
import { IHostedGameRepository } from "../../../domain/repositoryInterface/booking/hosted_game_repository_interface";
import { ICancelRequestRepository } from "../../../domain/repositoryInterface/booking/cancel_request_repository";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { ITurfRepository } from "../../../domain/repositoryInterface/Turf/turf_repository_interface";
import { CancellationRequestDTO } from "../../dtos/cancellation_request_dto";

@injectable()

export class RequestCancelHostedGameUseCase implements IRequestHostedGameCancelUseCase {
    constructor(
        @inject("IHostedGameRepository")
        private _hostedGameRepository:IHostedGameRepository,
        @inject("ICancelRequestRepository")
        private _cancelRequestRepository:ICancelRequestRepository,
        @inject("ITurfRepository")
        private _turfRepository:ITurfRepository
    ){}

    async execute(userId: string, hostedGameId: string, reason: string): Promise<CancellationRequestDTO> {
        const game = await this._hostedGameRepository.findById(hostedGameId)

        if(!game){
            throw new CustomError(
                ERROR_MESSAGES.NOT_GAME_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        if(game.hostUserId !== userId){
            throw new CustomError(
                ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                HTTP_STATUS.UNAUTHORIZED
            )
        }
        if(["cancelled","completed"].includes(game.status)){
            throw new CustomError(
                ERROR_MESSAGES.CANCELLATION_NOT_ALLOWED,
                HTTP_STATUS.BAD_REQUEST
            )
        }
         const now = new Date()
    const startTime = new Date(`${game.slotDate}T${game.startTime}`)
    const diffMinutes = (startTime.getTime() - now.getTime()) / 60000

    if (diffMinutes < 60) {
      throw new CustomError(
        ERROR_MESSAGES.CANCELLATION_NOT_ALLOWED,
        HTTP_STATUS.BAD_REQUEST
      )
    }
    const turf=await this._turfRepository.getTurfById(game.turfId)

    if(!turf){
        throw new CustomError(
            ERROR_MESSAGES.TURF_NOT_FOUND,
            HTTP_STATUS.NOT_FOUND
        )
    }
    await this._hostedGameRepository.updateStatusById(hostedGameId,"pending_cancel")
    const ownerId=turf.ownerId

   const request:CancellationRequestDTO ={
    hostedGameId,
    userId,
    ownerId,
    reason,
    status:"pending",
    createdAt:new Date()
   }

   return await this._cancelRequestRepository.createRequest(request)


    }
}