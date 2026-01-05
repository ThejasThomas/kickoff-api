import { IUserEntity } from "../../domain/models/user_entity";

export interface ITurfOwnerDTO extends Omit<IUserEntity, "fullName"> {
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
