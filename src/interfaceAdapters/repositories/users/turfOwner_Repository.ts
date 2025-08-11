import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import { ITurfOwnerModel, TurfOwnerModel } from "../../../frameworks/database/mongoDb/models/turfOwner_model";
import { ITurfOwnerRepository } from "../../../entities/repositoryInterface/users/turf_owner-repository.interface";

@injectable() export class TurfOwnerRepository extends BaseRepository<ITurfOwnerModel> implements ITurfOwnerRepository{
    constructor(){
        super(TurfOwnerModel)
    }
}