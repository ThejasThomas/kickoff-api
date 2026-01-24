"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const base_route_1 = require("./base_route");
const resolver_1 = require("../di/resolver");
const auth_middleware_1 = require("../middlewares/auth_middleware");
class AdminRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        this.router.get("/admin/users", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.userController.getAllUsers(req, res);
        });
        this.router.patch("/admin/status", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.userController.updateEntityStatus(req, res);
        });
        this.router.post("/admin/logout", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.authController.logout(req, res);
        });
        this.router.get("/admin/turfs", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.turfController.getAllTurfs(req, res);
        });
        this.router.post("/admin/refresh-token", auth_middleware_1.decodeToken, (req, res) => {
            resolver_1.authController.handleTokenRefresh(req, res);
        });
        this.router.get("/admin/refresh-session", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.userController.refreshSession(req, res);
        });
        this.router.get("/admin/get-turf-reviews/:turfId", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfController.getTurfReviewsForAdmin(req, res);
        });
        this.router.get("/admin/wallet", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.walletController.getAdminwallet(req, res);
        });
        this.router.get("/admin/wallet-transaction", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.walletController.getAdminWalletTransactions(req, res);
        });
        this.router.delete("/admin/delete-review/:reviewId", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.turfController.deleteReviewAdmin(req, res);
        });
        this.router.get("/admin/get-dashboard", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.adminController.adminDashboard(req, res);
        });
        this.router.get("/admin/owners-transaction", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.walletController.getAllOwnersTransactions(req, res);
        });
        this.router.get("/admin/transaction-details/:transactionId", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.walletController.getTransactionDetails(req, res);
        });
    }
}
exports.AdminRoutes = AdminRoutes;
