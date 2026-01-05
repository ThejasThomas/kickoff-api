import { ITurfResponseDTO } from "../../../application/dtos/turf_dto_response";
import { ITurfEntity } from "../../models/turf_entity";

export interface IAddTurfUseCase {
    execute(turfData:ITurfEntity,ownerId:string):Promise<ITurfResponseDTO>
}
