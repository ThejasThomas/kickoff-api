import { model, Schema } from "mongoose";
import { IAdminWalletEntity } from "../../../../domain/models/admin_wallet_entity";

const AdminWalletSchema =new Schema<IAdminWalletEntity>(
    {
        balance:{
            type:Number,
            required:true,
            default:0
        }
    },
    {timestamps:true}
)

export const AdminWalletModel = model<IAdminWalletEntity>(
  "AdminWallet",
  AdminWalletSchema
);