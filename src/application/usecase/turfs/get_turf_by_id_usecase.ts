import { inject, injectable } from "tsyringe";
import { IGetTurfByIdUseCase } from "../../../domain/useCaseInterfaces/turfOwner/turfs/get_turf_by_id_usecase_interface";
import { ITurfRepository } from "../../../domain/repositoryInterface/Turf/turf_repository_interface";
import { ITurfEntity } from "../../../domain/models/turf_entity";
import { ITurfResponseDTO } from "../../dtos/turf_dto_response";

@injectable()
export class GetTurfByIdUseCase implements IGetTurfByIdUseCase {
    constructor(
        @inject('ITurfRepository')
        private _turfRepository:ITurfRepository
    ){}

    async execute(turfId: string): Promise<ITurfResponseDTO> {
        const filter = {_id:turfId};



        const turf =await this._turfRepository.findOne(filter);
        if(!turf) {
            throw new Error("Turf not found or you do not have permission to access it")
        }


        const {id,...rest} =turf;
        const sanitizedTurf:ITurfEntity ={
            id:(id ?? "").toString(),
            ...rest
        };

        return sanitizedTurf;
    }
}