import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import {
  ITurfOwnerModel,
  TurfOwnerModel,
} from "../../database/mongoDb/models/turfOwner_model";
import { ITurfOwnerRepository } from "../../../domain/repositoryInterface/users/turf_owner-repository.interface";
import { ITurfOwnerEntity } from "../../../domain/models/turfOwner_entity";

@injectable()
export class TurfOwnerRepository
  extends BaseRepository<ITurfOwnerModel>
  implements ITurfOwnerRepository
{
  constructor() {
    super(TurfOwnerModel);
  }
  async updateOwnerStatus(
    userId: string,
    status: string
  ): Promise<ITurfOwnerEntity> {
    const updatedOwner = await this.model.findOneAndUpdate(
      { userId: userId },
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!updatedOwner) {
      console.error("No owner found with _id:", userId);
      throw new Error("Owner not found");
    }

    return updatedOwner as ITurfOwnerEntity;
  }
  async getAllOwnerUserIds(): Promise<string[]> {
    const owners = await TurfOwnerModel.find({}, { userId: 1, _id: 0 });
    return owners
      .map((owner) => owner.userId)
      .filter((id): id is string => typeof id === "string"); // ✅ TYPE GUARD
  }
}
