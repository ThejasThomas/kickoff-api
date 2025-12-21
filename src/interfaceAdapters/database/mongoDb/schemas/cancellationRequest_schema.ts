import { Schema } from "mongoose";
import { ICancellationRequestEntity } from "../../../../domain/models/cancellationRequest_entity";

export const CancellationRequestSchema = new Schema<ICancellationRequestEntity>(
  {
    bookingId: { type: String, required: true },
    userId: { type: String, required: true },
    ownerId: { type: String, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// export const CancellationRequestModel = model<ICancellationRequestEntity>(
//   "CancellationRequest",
//   CancellationRequestSchema
// );
