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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("./presentation/di/resolver");
const server_1 = require("./presentation/http/server");
const http_1 = require("http");
const config_1 = require("./shared/config");
const chalk_1 = __importDefault(require("chalk"));
const mongoConnect_1 = require("./interfaceAdapters/database/mongoDb/mongoConnect");
const socket_1 = require("./presentation/socket/socket");
const bookingCompletion_cron_1 = require("./presentation/cron/bookingCompletion.cron");
function startApp() {
    return __awaiter(this, void 0, void 0, function* () {
        const expressServer = new server_1.ExpressServer();
        const mongoConnect = new mongoConnect_1.MongoConnect();
        try {
            yield mongoConnect.connectDB();
            (0, bookingCompletion_cron_1.startBookingCompletionCron)();
            const httpServer = (0, http_1.createServer)(expressServer.getApp());
            (0, socket_1.initSocket)(httpServer);
            httpServer.listen(config_1.config.server.PORT, () => {
                console.log(chalk_1.default.yellowBright.bold(`Server running at ${chalk_1.default.blueBright(`http://localhost:${config_1.config.server.PORT}`)}`));
                console.log(chalk_1.default.greenBright("--------------------------------------------------\n"));
            });
        }
        catch (err) {
            console.error(chalk_1.default.redBright.bold("❌ Failed to start server"), err);
        }
    });
}
startApp();
