import { IUserEntity } from "./user_entity";

export interface ITurfOwnerEntity extends Omit<IUserEntity, "fullName"> {
  ownerName?: string;
  googleId?: string;
  profileImage?: string;
  address?: string;
  
  city?: string;
  state?: string;
  pinCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
