"use strict";
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
exports.OwnerWalletRepository = void 0;
const owner_wallet_schema_1 = require("../../database/mongoDb/schemas/owner_wallet_schema");
class OwnerWalletRepository {
    findByOwnerId(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield owner_wallet_schema_1.OwnerWalletModel.findOne({ ownerId }).lean();
        });
    }
    create(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield owner_wallet_schema_1.OwnerWalletModel.create({
                ownerId,
                balance: 0,
            });
            return wallet.toObject();
        });
    }
    incrementBalance(ownerId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            yield owner_wallet_schema_1.OwnerWalletModel.updateOne({ ownerId }, { $inc: { balance: amount } });
        });
    }
    decrementBalance(ownerId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            yield owner_wallet_schema_1.OwnerWalletModel.updateOne({ ownerId }, { $inc: { balance: -amount } });
        });
    }
}
exports.OwnerWalletRepository = OwnerWalletRepository;
