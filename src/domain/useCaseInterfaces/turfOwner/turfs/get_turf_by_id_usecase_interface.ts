import { ITurfResponseDTO } from "../../../../application/dtos/turf_dto_response";

export interface IGetTurfByIdUseCase{
    execute(turfId:string):Promise<ITurfResponseDTO>;
}