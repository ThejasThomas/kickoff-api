import { IUserEntity } from "./user_entity";

export interface IClientEntity extends IUserEntity {
    googleId?:string;
    geoLocation?:{
        type?:'Point';
        coordinates?:number[];
    };
    location?: {
        name?:string;
        displayName?:string;
        zipCode?:string;
    };
}
