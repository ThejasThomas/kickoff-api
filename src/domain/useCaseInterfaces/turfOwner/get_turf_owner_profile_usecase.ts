import { ITurfOwnerEntity } from "../../models/turfOwner_entity";

export interface ITurfOwnerDetailsUseCase{
    execute(ownerId:string):Promise<ITurfOwnerEntity>
}