"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRoutes = void 0;
const resolver_1 = require("../di/resolver");
const base_route_1 = require("./base_route");
const auth_middleware_1 = require("../middlewares/auth_middleware");
class ClientRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        this.router.get("/client/refresh-session", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.userController.refreshSession(req, res);
        });
        this.router.get("/client/get-turfdetails/:id", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfController.getTurfById(req, res);
        });
        this.router.get("/client/get-user-profile", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.userController.getUserDetails(req, res);
        });
        this.router.get("/client/getslots/:id", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfController.getSlots(req, res);
        });
        this.router.post("/client/refresh-token", auth_middleware_1.decodeToken, (req, res) => {
            resolver_1.authController.handleTokenRefresh(req, res);
        });
        this.router.get("/client/getturfs", (req, res) => {
            resolver_1.turfController.getAllTurfs(req, res);
        });
        this.router.post("/client/hold-slot", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.bookingsController.holdSlot(req, res);
        });
        this.router.post("/client/bookslots", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfController.bookslots(req, res);
        });
        this.router.get("/client/get-user-profile", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.userController.getUserDetails(req, res);
        });
        this.router.patch("/client/update-user-details", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.userController.updateUserDetails(req, res);
        });
        this.router.get("/client/getnearbyturf", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfController.getnearbyturfs(req, res);
        });
        this.router.get("/client/get-upcoming-bookings", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.bookingsController.getUpcomingbookings(req, res);
        });
        this.router.get("/client/upcoming-hosted-gamesbyuser", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.bookingsController.getUpcomingHostedGamesByUser(req, res);
        });
        this.router.get("/client/getbookingturf", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.bookingsController.getTurfdetails(req, res);
        });
        this.router.post("/client/cancel-hosted-game/:gameId", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.bookingsController.requestHostedGameCancellation(req, res);
        });
        this.router.get("/client/get-past-bookings", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.bookingsController.getPastbookings(req, res);
        });
        this.router.post("/client/add-money", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.walletController.addMoney(req, res);
        });
        this.router.get("/client/walletbalance", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.walletController.getWalletBalance(req, res);
        });
        this.router.get("/client/transactionhistory", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.walletController.getWalletHistory(req, res);
        });
        this.router.post("/client/cancel-request/:bookingId", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.bookingsController.requestCancellation(req, res);
        });
        this.router.post("/client/host-game", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.bookingsController.createGame(req, res);
        });
        this.router.get("/client/get-hosted-game", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.bookingsController.getUpcomingHostedGames(req, res);
        });
        this.router.post("/client/join-hosted-game", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.bookingsController.joinHostedGame(req, res);
        });
        this.router.get("/client/my-chat-groups", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.userController.getMyChatGroup(req, res);
        });
        this.router.get("/client/get-single-hosted-game/:id", auth_middleware_1.verifyAuth, (req, res) => {
            console.log("heyyyy brooohh");
            resolver_1.bookingsController.getSingleHostedGame(req, res);
        });
        this.router.get("/client/get-chats/:groupId", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.userController.getMessages(req, res);
        });
        this.router.post("/client/add-review", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfController.addReview(req, res);
        });
        this.router.post("/client/add-rating", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfController.addRating(req, res);
        });
        this.router.get("/client/get-reviews/:turfId", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfController.getTurfReviews(req, res);
        });
        this.router.get("/client/get-ratings/:turfId", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfController.getTurfRatings(req, res);
        });
        this.router.post("/client/logout", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.authController.logout(req, res);
        });
    }
}
exports.ClientRoutes = ClientRoutes;
