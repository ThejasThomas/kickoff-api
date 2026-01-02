"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGroupRepository = void 0;
const tsyringe_1 = require("tsyringe");
const chat_group_schema_1 = require("../../database/mongoDb/schemas/chat_group_schema");
const mongoose_1 = require("mongoose");
let ChatGroupRepository = class ChatGroupRepository {
    createGroup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield chat_group_schema_1.ChatGroupModel.create({
                hostedGameId: new mongoose_1.Types.ObjectId(data.hostedGameId),
                name: data.name,
                adminId: data.adminId,
                members: data.members,
            });
            return group.toObject();
        });
    }
    addMember(groupId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield chat_group_schema_1.ChatGroupModel.updateOne({ _id: new mongoose_1.Types.ObjectId(groupId) }, {
                $addToSet: { members: userId },
            });
        });
    }
    updateGroupName(groupId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield chat_group_schema_1.ChatGroupModel.updateOne({ _id: new mongoose_1.Types.ObjectId(groupId) }, { $set: { name } });
        });
    }
    findByHostedGameId(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield chat_group_schema_1.ChatGroupModel.findOne({
                hostedGameId: new mongoose_1.Types.ObjectId(gameId),
            }).lean();
            return group;
        });
    }
    findGroupsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('idsss', userId);
            return chat_group_schema_1.ChatGroupModel.aggregate([
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
        });
    }
    findGroupByIdWithMembers(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield chat_group_schema_1.ChatGroupModel.aggregate([
                {
                    $match: { _id: new mongoose_1.Types.ObjectId(groupId) },
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
        });
    }
};
exports.ChatGroupRepository = ChatGroupRepository;
exports.ChatGroupRepository = ChatGroupRepository = __decorate([
    (0, tsyringe_1.injectable)()
], ChatGroupRepository);
