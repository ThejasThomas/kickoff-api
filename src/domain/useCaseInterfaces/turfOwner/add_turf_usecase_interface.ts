import { ITurfEntity } from "../../models/turf_entity";

export interface IAddTurfUseCase {
    execute(turfData:ITurfEntity,ownerId:string):Promise<ITurfEntity>
}
