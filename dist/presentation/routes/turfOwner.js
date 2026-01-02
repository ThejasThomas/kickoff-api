"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerRoutes = void 0;
const resolver_1 = require("../di/resolver");
const base_route_1 = require("./base_route");
const auth_middleware_1 = require("../middlewares/auth_middleware");
class OwnerRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        this.router.get("/turfOwner/refresh-session", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.userController.refreshSession(req, res);
        });
        this.router.post("/turfOwner/add-turf", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfOwnerController.addTurf(req, res);
        });
        this.router.get("/turfOwner/profile", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfOwnerController.getOwnerDetails(req, res);
        });
        this.router.put("/turfOwner/request-update-profile", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfOwnerController.requestUpdateProfile(req, res);
        });
        this.router.post("/turfOwner/refresh-token", auth_middleware_1.decodeToken, (req, res) => {
            resolver_1.authController.handleTokenRefresh(req, res);
        });
        this.router.put("/turfOwner/update-profile", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfOwnerController.updateTurfOwnerProfile(req, res);
        });
        this.router.get("/turfOwner/getbookedclient-details/:userId", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.userController.getBookedUserDetails(req, res);
        });
        this.router.get("/turfOwner/get-my-turf", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfController.getMyTurf(req, res);
        });
        this.router.get("/turfOwner/get-turfdetails/:id", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfController.getTurfById(req, res);
        });
        this.router.put("/turfOwner/update-turf/:id", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfController.updateTurf(req, res);
        });
        this.router.get("/turfOwner/get-rules/:id", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfController.getrules(req, res);
        });
        this.router.post("/turfOwner/generateSlots", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfController.generateSlots(req, res);
        });
        this.router.post("/turfOwner/add-rules", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfController.addrules(req, res);
        });
        this.router.get("/turfOwner/get-all-bookings", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.bookingsController.getAllbookings(req, res);
        });
        this.router.post("/turfOwner/bookslot", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfController.bookslotsoffline(req, res);
        });
        this.router.post("/turfOwner/retry-approval", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfOwnerController.retryAdminApproval(req, res);
        });
        this.router.get("/turfOwner/getslots/:id", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfController.getSlots(req, res);
        });
        this.router.put("/turfOwner/handle-cancel-request/:requestId/:userId", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.bookingsController.handleOwnerCancelRequest(req, res);
        });
        this.router.get("/turfOwner/get-cancel-bookings", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.bookingsController.getCancelRequestBookings(req, res);
        });
        this.router.get("/turfOwner/get-single-hosted-game/:id", auth_middleware_1.verifyAuth, (req, res) => {
            console.log("heyyyy brooohh");
            resolver_1.bookingsController.getSingleHostedGame(req, res);
        });
        this.router.get("/turfOwner/check-slot-availability", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfController.checkIsSlotBooked(req, res);
        });
        this.router.get("/turfOwner/transactions", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.walletController.getOwnerWalletTransactions(req, res);
        });
        this.router.post("/turfOwner/cancel-slot", (req, res) => {
            resolver_1.turfController.cancelSlot(req, res);
        });
        this.router.get("/turfOwner/dashboard", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.turfOwnerController.getDashboard(req, res);
        });
        this.router.get("/turfOwner/get-wallet", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.walletController.getOwnerWallet(req, res);
        });
        this.router.post("/turfOwner/logout", auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.authController.logout(req, res);
        });
    }
}
exports.OwnerRoutes = OwnerRoutes;
