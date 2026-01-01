import { inject, injectable } from "tsyringe";
import { IHoldSlotUseCase } from "../../../domain/useCaseInterfaces/Bookings/hold_slot_usecase_interface";
import { IRedisTokenRepository } from "../../../domain/repositoryInterface/redis/redis_token_repository_interface";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()

export class HoldSlotUseCase implements IHoldSlotUseCase{
    constructor(
        @inject("IRedisTokenRepository")
        private _redisRepository:IRedisTokenRepository
    ){}

    async execute(turfId: string, date: string, startTime: string, endTime: string, userId: string): Promise<{success:boolean}> {
        const locked= await this._redisRepository.aquireLock(
            turfId,
            date,
            startTime,
            endTime,
            userId
        )

        if(!locked){
            throw new CustomError(
                ERROR_MESSAGES.SLOT_ALREADY_SELECTED,
                HTTP_STATUS.CONFLICT
            )
        }

        return {success:true}
    }
}