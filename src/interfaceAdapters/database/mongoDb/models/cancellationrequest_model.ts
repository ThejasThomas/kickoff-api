import { model } from "mongoose";
import { ICancellationRequestEntity } from "../../../../domain/models/cancellationRequest_entity";
import { CancellationRequestSchema } from "../schemas/cancellationRequest_schema";

export interface ICancellationRequestModel extends ICancellationRequestEntity{

}
export const CancellationRequestModel =model<ICancellationRequestModel>('CancellationRequests',CancellationRequestSchema)