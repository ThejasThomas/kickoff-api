import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import { ITurf, TurfModel } from "../../database/mongoDb/models/turf_model";

@injectable()
export class TurfRepository extends BaseRepository<ITurf>{
    constructor(){
        super(TurfModel)
    }
}