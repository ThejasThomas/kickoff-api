import { IReviewDTO } from "../../../application/dtos/review_dto";

export interface IAddReviewUseCase {
    execute(data:{
        userId:string;
        turfId:string;
        bookingId:string;
        comment:string
    }):Promise<IReviewDTO>
}