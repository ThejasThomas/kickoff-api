import { injectable } from "tsyringe";
import { IChatGroupRepository } from "../../../domain/repositoryInterface/chatgroup/chat_group_repository_interface";
import { IChatGroupEntity } from "../../../domain/models/Chat_group_entity";
import { ChatGroupModel } from "../../database/mongoDb/schemas/chat_group_schema";
import { Types } from "mongoose";
import { IChatGroupMembersEntity } from "../../../domain/models/chat_group_members_entity";

@injectable()
export class ChatGroupRepository implements IChatGroupRepository {
  async createGroup(data: IChatGroupEntity): Promise<IChatGroupEntity> {
    const group = await ChatGroupModel.create({
      hostedGameId: new Types.ObjectId(data.hostedGameId),
      name: data.name,
      adminId: data.adminId,
      members: data.members,
    });
    return group.toObject();
  }
  async addMember(groupId: string, userId: string): Promise<void> {
    await ChatGroupModel.updateOne(
      { _id: new Types.ObjectId(groupId) },
      {
        $addToSet: { members: userId },
      }
    );
  }
  async updateGroupName(groupId: string, name: string): Promise<void> {
    await ChatGroupModel.updateOne(
      { _id: new Types.ObjectId(groupId) },
      { $set: { name } }
    );
  }

  async findByHostedGameId(gameId: string): Promise<IChatGroupEntity | null> {
    const group = await ChatGroupModel.findOne({
      hostedGameId: new Types.ObjectId(gameId),
    }).lean();

    return group;
  }
  async findGroupsByUserId(userId: string): Promise<IChatGroupMembersEntity[]> {
    console.log('idsss',userId)
    return ChatGroupModel.aggregate([
      {
        $match: {
          members: userId,
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "members",
          foreignField: "userId",
          as: "membersInfo",
        },
      },
      {
        $project: {
          name: 1,
          hostedGameId: 1,
          adminId: 1,
          members: 1,
          createdAt: 1,
          membersInfo: {
            $map: {
              input: "$membersInfo",
              as: "member",
              in: {
                userId: "$$member.userId",
                fullName: "$$member.fullName",
                email: "$$member.email",
              },
            },
          },
        },
      },
    ]);
  }
  async findGroupByIdWithMembers(groupId: string): Promise<IChatGroupMembersEntity | null> {
    const result = await ChatGroupModel.aggregate([
    {
      $match: { _id: new Types.ObjectId(groupId) },
    },
    {
      $lookup: {
        from: "clients",
        localField: "members",
        foreignField: "userId",
        as: "membersInfo",
      },
    },
    {
      $project: {
        name: 1,
        hostedGameId: 1,
        adminId: 1,
        members: 1,
        createdAt: 1,
        membersInfo: {
          $map: {
            input: "$membersInfo",
            as: "member",
            in: {
              userId: "$$member.userId",
              fullName: "$$member.fullName",
              email: "$$member.email",
            },
          },
        },
      },
    },
  ]);

  return result[0] || null;
  }
}
