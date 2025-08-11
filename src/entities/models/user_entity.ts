import { statusTypes, TRole } from "../../shared/constants";

export interface IUserEntity {
    userId?:string;
    fullName:string;
    email:string;
    phoneNumber?:string;
    password:string;
    role?:TRole;
    status?:statusTypes
    createdAt?: Date;
    updatedAt?: Date;
}

