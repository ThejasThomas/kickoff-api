import {Document,model, ObjectId } from "mongoose";
import { IClientEntity } from "../../../../domain/models/client_entity";
import { clientSchema } from "../schemas/client_schema";

export interface IClientModel extends IClientEntity,Document {
    _id:ObjectId;
}

export const ClientModel =model<IClientModel>('Client',clientSchema);