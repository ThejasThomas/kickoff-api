import { ITurfOwnerDTO } from "../../../application/dtos/turfowner_dto";
import { ITurfOwnerEntity } from "../../models/turfOwner_entity";

export interface IUpdateTurfOwnerProfileUseCase {
    execute(ownerId:string,profileData:Partial<ITurfOwnerEntity>):Promise<ITurfOwnerDTO>;
}
