import { ITurfEntity } from "../models/turf_entity";

export interface ITurfService {
    findTurfById(turfId:string):Promise<ITurfEntity | null>;
    updateTurf(turfId:string,turfData:Partial<ITurfEntity>):Promise<ITurfEntity>
}