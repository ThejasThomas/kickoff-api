import { injectable } from "tsyringe";
import { IChatMessageRepository } from "../../../domain/repositoryInterface/chatgroup/chat_message_repository_interface";
import { IChatMessageEntity } from "../../../domain/models/chat_message_entity";
import { ChatMessageModel } from "../../database/mongoDb/models/chat_message_model";
import { Types } from "mongoose";

@injectable()
export class ChatMessageRepository implements IChatMessageRepository{
    async createMessage(message: IChatMessageEntity): Promise<IChatMessageEntity> {
        const created =await ChatMessageModel.create({
            groupId:new Types.ObjectId(message.groupId),
            senderId:message.senderId,
            text:message.text,
        })

        return {
            _id:created._id,
            groupId:created.groupId.toString(),
            senderId:created.senderId,
            text:created.text,
            createdAt:created.createdAt
        }
    }

    async getMessageByGroupId(groupId: string): Promise<IChatMessageEntity[]> {
        const message =await ChatMessageModel.find({
            groupId:new Types.ObjectId(groupId),
        })
        .sort({createdAt:1})
        .lean();


        return message.map((msg)=>({
            _id:msg._id,
            groupId:msg.groupId.toString(),
            senderId:msg.senderId,
            text:msg.text,
            createdAt:msg.createdAt
        }))
    }
}