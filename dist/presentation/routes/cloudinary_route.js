"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryRoutes = void 0;
const resolver_1 = require("../di/resolver");
const base_route_1 = require("./base_route");
class CloudinaryRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        this.router.get('/turfOwner/signature', resolver_1.authController.getUploadSignature.bind(resolver_1.authController));
    }
}
exports.CloudinaryRoutes = CloudinaryRoutes;
