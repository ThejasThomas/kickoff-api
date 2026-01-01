import { injectable } from "tsyringe";
import { IChatMessageRepository } from "../../../domain/repositoryInterface/chatgroup/chat_message_repository_interface";
import { IChatMessageEntity } from "../../../domain/models/chat_message_entity";
import { ChatMessageModel } from "../../database/mongoDb/models/chat_message_model";
import { Types } from "mongoose";
import { BaseRepository } from "../base_repository";

@injectable()
export class ChatMessageRepository
  extends BaseRepository<any>
  implements IChatMessageRepository
{
    
  constructor() {
    super(ChatMessageModel);   
  }
  async createMessage(
    message: IChatMessageEntity
  ): Promise<IChatMessageEntity> {
    const created = await ChatMessageModel.create({
      groupId: new Types.ObjectId(message.groupId),
      senderId: message.senderId,
      text: message.text,
      replyTo:message.replyTo ?{
        messageId: new Types.ObjectId(message.replyTo.messageId),
          senderId: message.replyTo.senderId,
          text: message.replyTo.text,
      }:undefined
    });

    return {
      _id: created._id,
      groupId: created.groupId.toString(),
      senderId: created.senderId,
      text: created.text,
      replyTo:created.replyTo && created.replyTo.messageId ?{
        messageId: created.replyTo.messageId.toString(),
          senderId: created.replyTo.senderId,
          text: created.replyTo.text,
      }:undefined,
      createdAt: created.createdAt,
      
    };
  }

  async getMessageByGroupId(groupId: string): Promise<IChatMessageEntity[]> {
    const message = await ChatMessageModel.find({
      groupId: new Types.ObjectId(groupId),
    })
      .sort({ createdAt: 1 })
      .lean();

    return message.map((msg) => ({
      _id: msg._id,
      groupId: msg.groupId.toString(),
      senderId: msg.senderId,
      text: msg.text,
      isDeleted: msg.isDeleted,
      replyTo: msg.replyTo && msg.replyTo.messageId
    ? {
        messageId: msg.replyTo.messageId?.toString(),
        senderId: msg.replyTo.senderId,
        text: msg.replyTo.text,
      }
    : undefined,
      createdAt: msg.createdAt,
    }));
  }
  async findByIdd(id: string): Promise<IChatMessageEntity | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const msg = await this.model.findById(id).lean();
    return msg ? this.toEntity(msg) : null;
  }
  //     async updateOnee(id: string, update: Partial<IChatMessageEntity>) {
  //   return this.model.updateOne(
  //     { _id: new Types.ObjectId(id) },
  //     { $set: update }
  //   );
  // }

  private toEntity(msg: any): IChatMessageEntity {
  return {
    _id: msg._id?.toString(),
    groupId: msg.groupId.toString(),
    senderId: msg.senderId,
    text: msg.text,
    isDeleted: msg.isDeleted,
    createdAt: msg.createdAt,
  };
}
async softDeleteById(id: string): Promise<void> {
  await ChatMessageModel.updateOne(
    {_id:new Types.ObjectId(id)},
    {
      $set:{
        isDeleted:true,
        text:"",
      }
    }
  )
}
}


