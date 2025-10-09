import { ITurfOwnerEntity } from "../../domain/models/turfOwner_entity";
import { ITurfOwnerModel } from "../../interfaceAdapters/database/mongoDb/models/turfOwner_model";
import { IOwnerDTO } from "../dtos/owner_dto";

export function mapOwnerDetails(entity: ITurfOwnerEntity): IOwnerDTO {
  return {
    ownerName: entity.ownerName,
    email: entity.email,
    phoneNumber: entity.phoneNumber,
    profileImage: entity.profileImage,
    status:entity.status,
    address: entity.address,
    city: entity.city,
    state: entity.state,
    pinCode: entity.pinCode,
  };
}
