import { TRole } from "../../shared/constants";

export interface AdminDTO{
    userId?:string;
    fullName?:string;
    email:string;
    password?:string;
    role:'admin';
}

export interface ClientDTO {
    userId?:string;
    fullName:string;
    email:string;
    phoneNumber?:string;
    password?:string;
    googleId?:string;
    role:'client';
}

export interface TurfOwnerDTO {
    googleId?:string;
    userId?:string;
    ownerName:string;
    email:string;
    phoneNumber?:string;
    password?:string;
    role:'turfOwner'
}

export type UserDTO=AdminDTO |ClientDTO |TurfOwnerDTO

export interface LoginUserDTO{
    email:string;
    password?:string;
    role:TRole
}