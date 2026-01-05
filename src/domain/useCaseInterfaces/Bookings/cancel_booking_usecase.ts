import { CancellationRequestDTO } from "../../../application/dtos/cancellation_request_dto";

export interface IRequestCancelBookingUseCase{
    execute(userId:string,bookingId:string,reason:string):Promise<CancellationRequestDTO>

    }
