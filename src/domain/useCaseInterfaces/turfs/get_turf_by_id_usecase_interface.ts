import { ITurfEntity } from "../../models/turf_entity";

export interface IGetTurfByIdUseCase{
    execute(turfId:string,ownerId:string):Promise<ITurfEntity>;
}