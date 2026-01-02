"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressServer = void 0;
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = require("../../shared/config");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const auth_route_1 = require("../routes/auth_route");
const admin_route_1 = require("../routes/admin_route");
const turfOwner_1 = require("../routes/turfOwner");
const cloudinary_route_1 = require("../routes/cloudinary_route");
const client_route_1 = require("../routes/client_route");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const stripe_route_1 = require("../routes/stripe_route");
const error_handler_1 = require("../../shared/utils/error_handler");
class ExpressServer {
    constructor() {
        this._app = (0, express_1.default)();
        this.configureMiddlewares();
        this.configureRoutes();
    }
    configureMiddlewares() {
        this._app.use((0, helmet_1.default)());
        this._app.use((0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000,
            max: 1000,
        }));
        this._app.use((0, cors_1.default)({
            origin: config_1.config.cors.FRONTEND_URL,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            credentials: true,
        }));
        this._app.use(express_1.default.json());
        this._app.use(express_1.default.urlencoded({ extended: true }));
        this._app.use((0, cookie_parser_1.default)());
        const logsDir = path_1.default.join(__dirname, "../shared/utils/logs");
        if (!fs_1.default.existsSync(logsDir)) {
            fs_1.default.mkdirSync(logsDir, { recursive: true });
        }
        const logStream = fs_1.default.createWriteStream(path_1.default.join(logsDir, "access.log"), { flags: 'a' });
        this._app.use((0, morgan_1.default)("dev"));
        this._app.use((0, morgan_1.default)("combined", { stream: logStream }));
    }
    configureRoutes() {
        this._app.use("/auth", new auth_route_1.AuthRoutes().router);
        this._app.use("/_ad", new admin_route_1.AdminRoutes().router);
        this._app.use("/_ow", new turfOwner_1.OwnerRoutes().router);
        this._app.use("/_cl", new client_route_1.ClientRoutes().router);
        this._app.use("/api/cloudinary", new cloudinary_route_1.CloudinaryRoutes().router);
        this._app.use("/api/payment", new stripe_route_1.PaymentRoutes().router);
        this._app.use(error_handler_1.handleErrorResponse);
    }
    getApp() {
        return this._app;
    }
}
exports.ExpressServer = ExpressServer;
