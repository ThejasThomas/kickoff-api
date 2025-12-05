import { IBookingModel } from "../../interfaceAdapters/database/mongoDb/models/booking_model";
import { BookingDTO, PastBookingDTO } from "../dtos/get_booking_dto";

export function mapBookingDTO(entity: IBookingModel): BookingDTO {
  return {
    _id:entity._id?.toString(),
    userId: entity.userId,
    turfId: entity.turfId,
    startTime: entity.startTime,
    endTime: entity.endTime,
    price: entity.price,
    date: entity.date,
    status: entity.status,
    paymentMethod: entity.paymentMethod,
    paymentStatus: entity.paymentStatus,
    createdAt: entity.createdAt,
  };
}

export function mapPastBookingDTO(entity: IBookingModel): PastBookingDTO {
  return {
    date: entity.date,
    startTime: entity.startTime,
    endTime: entity.endTime,
    price: entity.price,
    status: entity.status,
    paymentStatus: entity.paymentStatus,
  };
}

export function mapBookingDTOList(entities: IBookingModel[]): BookingDTO[] {
  return entities.map(mapBookingDTO);
}


export function mapPastBookingList(entities:IBookingModel[]):PastBookingDTO[]{
    return entities.map(mapPastBookingDTO)
}
