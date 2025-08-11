import { Document,model,ObjectId } from "mongoose";
import { ITurfOwnerEntity } from "../../../../entities/models/turfOwner_entity";
import { turfOwnerSchema } from "../schemas/turfOwner_schema";

export interface ITurfOwnerModel extends ITurfOwnerEntity,Document {
    _id:ObjectId;
}
export const TurfOwnerModel =model<ITurfOwnerModel>('TurfOwner',turfOwnerSchema)