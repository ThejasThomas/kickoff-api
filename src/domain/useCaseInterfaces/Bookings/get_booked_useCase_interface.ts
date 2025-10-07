import { ITurfEntity } from "../../models/turf_entity";

export interface IGetBookedTurfUseCase {
    execute(turfId:string):Promise<ITurfEntity>
}