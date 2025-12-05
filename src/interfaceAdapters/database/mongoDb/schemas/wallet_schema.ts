import { model, Schema } from "mongoose";
import { IWalletEntity, WalletTransactionStatus, WalletTransactionType } from "../../../../domain/models/wallet_entity";

export const WalletSchema =new Schema<IWalletEntity>(
    {
        userId:{
            type:String,
            required:true
        },
        type:{
            type:String,
            required:true,
            enum:Object.values(WalletTransactionType)
        },
        amount:{
            type:Number,
            required:true
        },
        reason:{
            type:String,
            required:true,
            trim:true
        },
        status:{
            type:String,
            required:true,
            enum:Object.values(WalletTransactionStatus)
        },
        transaction_date:{
            type:String,
            required:true
        }
    },
    {timestamps:true},
)
export const WalletModel =model<IWalletEntity>("Wallet",WalletSchema);
