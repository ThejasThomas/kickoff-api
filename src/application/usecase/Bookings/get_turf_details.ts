import { injectable } from "tsyringe";
import { IGetBookedTurfUseCase } from "../../../domain/useCaseInterfaces/Bookings/get_booked_useCase_interface";
import { ITurfEntity } from "../../../domain/models/turf_entity";
import { TurfModel } from "../../../interfaceAdapters/database/mongoDb/models/turf_model";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";


@injectable()
export class GetBookedTurfDetails implements IGetBookedTurfUseCase {
    constructor(

    ){}

    async execute(turfId: string): Promise<ITurfEntity> {
        try{
            const turf =await TurfModel.findById(turfId)
            if(!turf) {
                throw new CustomError(
                    ERROR_MESSAGES.TURF_NOT_FOUND,
                    HTTP_STATUS.NOT_FOUND
                )
            }
            return turf
        }catch(error){
            if(error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(
                ERROR_MESSAGES.FAILED_TO_FETCH_TURF_DETAILS,
                HTTP_STATUS.INTERNAL_SERVER_ERROR
            )
        }
    }
}