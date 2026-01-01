import { IRatingEntity, ITurfRatingResult } from "../../models/rating_entity";

export interface IRatingRepository {
    create(data:Partial<IRatingEntity>):Promise<IRatingEntity>;
    findByBookingId(bookingId:string):Promise<IRatingEntity | null>
    findByBookingIds(bookingIds:string[]):Promise<string[]>
    getTurfRatings(turfId:string,page:number,limit:number):Promise<ITurfRatingResult>
}