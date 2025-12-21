import { model, Schema } from "mongoose";
import { IHostedGameEntity } from "../../../../domain/models/hosted_game_entity";

const PlayerSchema = new Schema(
  {
    userId: String,
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    paymentId: String,
    joinedDate: Date,
  },
  { _id: false }
);

export const HostedGameSchema = new Schema<IHostedGameEntity>({
  hostUserId: { type: String, required: true },
  turfId: {
    type: String,
    required: true,
  },
  courtType: {
    type: String,
    required: true,
  },
  slotDate: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  pricePerPlayer: {
    type: Number,
    required: true,
  },

  capacity: {
    type: Number,
    required: true,
  },
  gameStartAt:{
    type:Date,
    required:true,
    index:true
  },
  players:{
    type:[PlayerSchema],
    default:[]
  },

  status:{
    type:String,
    enum:["open","full","cancelled","completed"],
    default:"open",
  }
},
{timestamps:true}
);

export const HostedGameModel =model<IHostedGameEntity>(
    "HosteGame",
    HostedGameSchema
)
