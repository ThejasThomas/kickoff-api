import { model, Schema } from "mongoose";
import { IWalletEntity } from "../../../../domain/models/wallet_entity";

export const WalletSchema =new Schema<IWalletEntity>(
    {
        userId:{
            type:String,
            required:true
        },
        balance:{
            type:Number,
            required:true
        }
    },
    {timestamps:true},
)
export const WalletModel =model<IWalletEntity>("Wallet",WalletSchema);
