import { ITurfOwnerEntity } from "../../models/turfOwner_entity";
import { IBaseRepository } from "../base-repository.interface";

export interface ITurfOwnerRepository extends IBaseRepository<ITurfOwnerEntity>{
      updateOwnerStatus(ownerId: string, status: string): Promise<ITurfOwnerEntity>;
      getAllOwnerUserIds():Promise<string[]>
}