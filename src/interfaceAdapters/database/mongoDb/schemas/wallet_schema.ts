import { model, Schema } from "mongoose";
import { IWalletEntity, WalletTransactionStatus, WalletTransactionType } from "../../../../domain/models/wallet_entity";
import { required } from "zod/v4/core/util.cjs";

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
