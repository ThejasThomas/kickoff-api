import { ITurfEntity } from "../../domain/models/turf_entity";
import { GetTurfDTO } from "../dtos/get_turf_dto";

export function mapGetTurfDTO(entity: ITurfEntity): GetTurfDTO {
  return {
    _id: (entity.id ?? entity._id)?.toString(),
    turfName: entity.turfName,
    contactNumber: entity.contactNumber,
    images: entity.images,
    pricePerHour: entity.pricePerHour,
    location: {
      address: entity.location.address,
      city: entity.location.city,
      state: entity.location.state,
    },
    courtType: entity.courtType,
    status: entity.status,
    ownerId: entity.ownerId,
  };
}
