import { model, Schema } from "mongoose";
import { IRules } from "../../../../domain/models/rule_entity";
import { required } from "zod/v4/core/util.cjs";

export const RulesSchema = new Schema<IRules>(
  {
    turfId: {
      type: String,
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
      index: true,
    },
    slotDuration: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    weeklyRules: [
      {
        type: Map,
        of: [
          {
            startTime: {
              type: String,
              required: true,
            },
            endTime: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
    exceptions: [
      {
        date: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);



RulesSchema.index({ turfId: 1 });
