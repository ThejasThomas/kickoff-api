import { FilterQuery } from "mongoose";
import { ITurf } from "../../../interfaceAdapters/database/mongoDb/models/turf_model";
import { IBaseRepository } from "../base-repository.interface";

export interface ITurfRepository extends IBaseRepository<ITurf>{
    findNearbyTurfs(latitude:number,longitude:number,maxDistance:number,filter:FilterQuery<[ITurf]>,skip:number,limit:number):Promise<{items:ITurf[],total:number}>
}
