import { ITurfOwnerEntity } from "../../models/turfOwner_entity";

export interface IUpdateTurfOwnerProfileUseCase {
    execute(ownerId:string,profileData:Partial<ITurfOwnerEntity>):Promise<ITurfOwnerEntity>;
}
