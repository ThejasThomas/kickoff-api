import { inject, injectable } from "tsyringe";
import { IReleaseSlotUsecase } from "../../../domain/useCaseInterfaces/Bookings/release_slot_usecase_interface";
import { ISlotLockRepository } from "../../../domain/repositoryInterface/slotLock/slot_lock_repository_interface";

@injectable()

export class ReleaseSlotUseCase implements IReleaseSlotUsecase{
    constructor(
        @inject("ISlotLockRepository")
        private redisRepository:ISlotLockRepository
    ){}

    async execute(turfId: string, date: string, startTime: string, endTime: string, userId: string): Promise<void> {
        await this.redisRepository.releaseLock(
            turfId,
            date,
            startTime,
            endTime,
            userId
        )
    }
}