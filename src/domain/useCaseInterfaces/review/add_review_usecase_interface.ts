import { IReviewEntity } from "../../models/review_entity";

export interface IAddReviewUseCase {
    execute(data:{
        userId:string;
        turfId:string;
        bookingId:string;
        comment:string
    }):Promise<IReviewEntity>
}