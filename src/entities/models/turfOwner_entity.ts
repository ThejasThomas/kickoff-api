import { IUserEntity } from "./user_entity";

export interface ITurfOwnerEntity extends Omit<IUserEntity,'fullName'>{
    ownerName?:string;
    // description?:string;
    googleId?:string;
    // location?:string;
    // isApproved?:boolean;
    profilePicture?:string;
    // availableSlots:{
    //     [day: string]: {
    //         open?:string;
    //         close?:string;
    //     } | null;
    // }
    // amenities: {
    //     Parking:boolean;
    //     ChangingRooms:boolean;
    //     DrinkingWater:boolean;
    //     WashingRooms:boolean;
    //     Wifi:boolean;

    // },
    // geoLocation?: {
    //     type?:'Point';
    //     coordinates?:number[];
    // },
    // location?: {
    //     name:string;
    //     displayName?:string;
    //     zipCode?:string;
    // }
    createdAt?:Date;
    updatedAt?:Date;

}