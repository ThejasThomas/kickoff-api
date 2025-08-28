import { model } from "mongoose";
import { ITurfEntity } from "../../../../entities/models/turf_entity";
import { TurfSchema } from "../schemas/turf_schema";

export interface ITurf extends ITurfEntity{

}

export const TurfModel=model<ITurf>('Turf',TurfSchema)

