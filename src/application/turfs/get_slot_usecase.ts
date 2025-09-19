import { inject, injectable } from "tsyringe";
import { IGetSlotsUseCase } from "../../domain/useCaseInterfaces/turfs/get_slots_usecase";
import { ISlotRepository } from "../../domain/repositoryInterface/Turf/slot_repository_interface";
import { ISlotEntity } from "../../domain/models/slot_entity";
import { ISlotService } from "../../domain/serviceInterfaces/slot_service_interface";
import { CustomError } from "../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()

export class GetSlotsUseCase implements IGetSlotsUseCase {
    constructor(
        @inject('ISlotRepository') 
        private _slotRepository:ISlotRepository,
        @inject('ISlotService')
        private _slotService:ISlotService
    ){}

    async execute(turfId: string, date: string): Promise<ISlotEntity[]> {
        try{
            const slots =await this._slotService.findByTurfIdAndDate(turfId,date)
            console.log('slotssss',slots)
            return slots;
        }catch(error){
            throw new CustomError(ERROR_MESSAGES.SLOT_NOT_DOUND,HTTP_STATUS.NOT_FOUND)
        }
    }
}