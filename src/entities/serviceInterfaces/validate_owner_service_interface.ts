import { promises } from "dns"
import { ITurfEntity } from "../models/turf_entity"

export interface IValidateOwnerService {
    ownerExists(ownerId:string):Promise<boolean>
    findOwner(ownerId:string):Promise<void>
    // validateTufData(turfData:ITurfEntity):Promise<void>
    // checkDuplicateTurf(ownerId:string,turfName:string):Promise<void>
    // handleImageUpload(images:string[],ownerId:string):Promise<string[]>
}