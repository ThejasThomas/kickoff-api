"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const resolver_1 = require("../di/resolver");
const base_route_1 = require("./base_route");
const auth_middleware_1 = require("../middlewares/auth_middleware");
class PaymentRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        this.router.post("/create-checkout-session", (req, res) => {
            resolver_1.userController.stripePaymentSession(req, res);
        });
        this.router.post("/create-wallet-session", (req, res) => {
            resolver_1.userController.createWalletCheckoutSession(req, res);
        });
        this.router.get("/verify-session/:id", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), (req, res) => {
            resolver_1.userController.verifyPaymentSession(req, res);
        });
        this.router.post("/create-host-session", (req, res) => {
            resolver_1.userController.createHostedGameCheckoutSession(req, res);
        });
        this.router.post("/create-join-hosted-game-session", (req, res) => {
            resolver_1.userController.createJoinHostedGameCheckoutSession(req, res);
        });
    }
}
exports.PaymentRoutes = PaymentRoutes;
