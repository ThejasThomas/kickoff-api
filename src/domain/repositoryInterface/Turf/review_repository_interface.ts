import { IReviewEntity } from "../../models/review_entity";

export interface IReviewRepository{
    create(review:IReviewEntity):Promise<IReviewEntity>;
    findByBookingId(bookingId:string):Promise<IReviewEntity | null>;
    findByTurfId(turfId:string):Promise<IReviewEntity[]>
    hasReviewForBooking(bookingId:string):Promise<boolean>
    findByBookingIds(bookingIds: string[]): Promise<string[]>;
    findByTurfIdPaginated(turfId:string,page:number,limit:number):Promise<{reviews:IReviewEntity[];total:number}>
    deleteById(reviewId:string):Promise<void>
}