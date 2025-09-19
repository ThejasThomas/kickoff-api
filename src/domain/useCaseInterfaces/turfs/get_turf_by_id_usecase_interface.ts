import { ITurfEntity } from "../../models/turf_entity";

export interface IGetTurfByIdUseCase{
    execute(turfId:string):Promise<ITurfEntity>;
}