import { verifyAuth } from "../../interfaceAdapters/middlewares/auth_middleware";
import { authController } from "../di/resolver";
import { BaseRoute } from "./base_route";

export class CloudinaryRoutes extends BaseRoute {
    constructor(){
        super()
    }
    protected initializeRoutes(): void {
        this.router.get('/turfOwner/signature',authController.getUploadSignature.bind(authController))
    }
}
