import { promises } from "dns"
import { ITurfEntity } from "../models/turf_entity"
import { ITurfOwnerEntity } from "../models/turfOwner_entity"

export interface IValidateOwnerService {
    ownerExists(ownerId:string):Promise<boolean>
    findOwner(ownerId:string):Promise<ITurfOwnerEntity>
    updateOwner(ownerId:string,profileData:Partial<ITurfOwnerEntity>):Promise<ITurfOwnerEntity>
    // validateTufData(turfData:ITurfEntity):Promise<void>
    // checkDuplicateTurf(ownerId:string,turfName:string):Promise<void>
    // handleImageUpload(images:string[],ownerId:string):Promise<string[]>
}