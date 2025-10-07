export interface GetTurfDTO {
    _id?:string;
    turfName:string;
    contactNumber:string;
    images:string[]
    pricePerHour:string,
    location:{
        address:string;
        city:string;
        state?:string;
    };
    courtType:string;
    status:string;
    ownerId:string;
}