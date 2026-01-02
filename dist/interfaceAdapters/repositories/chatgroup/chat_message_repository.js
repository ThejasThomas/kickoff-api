"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.ChatMessageRepository = void 0;
const tsyringe_1 = require("tsyringe");
const chat_message_model_1 = require("../../database/mongoDb/models/chat_message_model");
const mongoose_1 = require("mongoose");
const base_repository_1 = require("../base_repository");
let ChatMessageRepository = class ChatMessageRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(chat_message_model_1.ChatMessageModel);
    }
    createMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = yield chat_message_model_1.ChatMessageModel.create({
                groupId: new mongoose_1.Types.ObjectId(message.groupId),
                senderId: message.senderId,
                text: message.text,
                replyTo: message.replyTo ? {
                    messageId: new mongoose_1.Types.ObjectId(message.replyTo.messageId),
                    senderId: message.replyTo.senderId,
                    text: message.replyTo.text,
                } : undefined
            });
            return {
                _id: created._id,
                groupId: created.groupId.toString(),
                senderId: created.senderId,
                text: created.text,
                replyTo: created.replyTo && created.replyTo.messageId ? {
                    messageId: created.replyTo.messageId.toString(),
                    senderId: created.replyTo.senderId,
                    text: created.replyTo.text,
                } : undefined,
                createdAt: created.createdAt,
            };
        });
    }
    getMessageByGroupId(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield chat_message_model_1.ChatMessageModel.find({
                groupId: new mongoose_1.Types.ObjectId(groupId),
            })
                .sort({ createdAt: 1 })
                .lean();
            return message.map((msg) => {
                var _a;
                return ({
                    _id: msg._id,
                    groupId: msg.groupId.toString(),
                    senderId: msg.senderId,
                    text: msg.text,
                    isDeleted: msg.isDeleted,
                    replyTo: msg.replyTo && msg.replyTo.messageId
                        ? {
                            messageId: (_a = msg.replyTo.messageId) === null || _a === void 0 ? void 0 : _a.toString(),
                            senderId: msg.replyTo.senderId,
                            text: msg.replyTo.text,
                        }
                        : undefined,
                    createdAt: msg.createdAt,
                });
            });
        });
    }
    findByIdd(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                return null;
            }
            const msg = yield this.model.findById(id).lean();
            return msg ? this.toEntity(msg) : null;
        });
    }
    //     async updateOnee(id: string, update: Partial<IChatMessageEntity>) {
    //   return this.model.updateOne(
    //     { _id: new Types.ObjectId(id) },
    //     { $set: update }
    //   );
    // }
    toEntity(msg) {
        var _a;
        return {
            _id: (_a = msg._id) === null || _a === void 0 ? void 0 : _a.toString(),
            groupId: msg.groupId.toString(),
            senderId: msg.senderId,
            text: msg.text,
            isDeleted: msg.isDeleted,
            createdAt: msg.createdAt,
        };
    }
    softDeleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield chat_message_model_1.ChatMessageModel.updateOne({ _id: new mongoose_1.Types.ObjectId(id) }, {
                $set: {
                    isDeleted: true,
                    text: "",
                }
            });
        });
    }
};
exports.ChatMessageRepository = ChatMessageRepository;
exports.ChatMessageRepository = ChatMessageRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], ChatMessageRepository);
