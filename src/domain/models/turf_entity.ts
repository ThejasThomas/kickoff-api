import { ObjectId } from "mongoose";

export interface ITurfEntity {
    id?:string;
    _id?: string | ObjectId;
    ownerId:string;
    turfName:string;
    description:string;
    location: {
        address:string;
        city:string;
        state?:string;
        coordinates: {
            type:string;
            coordinates:[number,number];
        }
    }
    amenities:string[];
    images:string[];
    contactNumber:string;
    pricePerHour:string;
    courtType:string;
    status:"active" | "inactive" | "pending" | "rejected";
    createdAt?:Date;
    updatedAt?:Date;
    openingTime?:string;
    closingTime?:string;
    slotDuration?:number;
}


