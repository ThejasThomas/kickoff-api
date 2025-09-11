import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import { ITurfOwnerModel, TurfOwnerModel } from "../../database/mongoDb/models/turfOwner_model";
import { ITurfOwnerRepository } from "../../../domain/repositoryInterface/users/turf_owner-repository.interface";
import { ITurfOwnerEntity } from "../../../domain/models/turfOwner_entity";

@injectable() export class TurfOwnerRepository extends BaseRepository<ITurfOwnerModel> implements ITurfOwnerRepository{
    constructor(){
        super(TurfOwnerModel)
    }
   async updateOwnerStatus(userId: string, status: string): Promise<ITurfOwnerEntity> {
    console.log("Updating owner with _id:", userId);

    const updatedOwner = await this.model.findOneAndUpdate(
        { userId: userId },   // use _id instead of userId
        { $set: { status } },
        { new: true, runValidators: true }
    );

    if (!updatedOwner) {
        console.error("No owner found with _id:", userId);
        throw new Error("Owner not found");
    }

    console.log("Updated owner document:", updatedOwner);
    return updatedOwner as ITurfOwnerEntity;
}
}
