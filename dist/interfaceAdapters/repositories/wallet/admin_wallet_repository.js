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
exports.AdminWalletRepository = void 0;
const tsyringe_1 = require("tsyringe");
const admin_wallet_schema_1 = require("../../database/mongoDb/schemas/admin_wallet_schema");
let AdminWalletRepository = class AdminWalletRepository {
    getWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            let wallet = yield admin_wallet_schema_1.AdminWalletModel.findOne();
            if (!wallet) {
                wallet = yield admin_wallet_schema_1.AdminWalletModel.create({ balance: 0 });
            }
            return wallet;
        });
    }
    incrementBalance(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            yield admin_wallet_schema_1.AdminWalletModel.findOneAndUpdate({}, { $inc: { balance: amount } }, { upsert: true });
        });
    }
    decrementBalance(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            yield admin_wallet_schema_1.AdminWalletModel.findOneAndUpdate({}, { $inc: { balance: -amount } }, { upsert: true });
        });
    }
};
exports.AdminWalletRepository = AdminWalletRepository;
exports.AdminWalletRepository = AdminWalletRepository = __decorate([
    (0, tsyringe_1.injectable)()
], AdminWalletRepository);
