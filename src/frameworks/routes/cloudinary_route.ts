import { authController } from "../di/resolver";
import { BaseRoute } from "./base_route";

export class CloudinaryRoutes extends BaseRoute {
    constructor(){
        super()
    }
    protected initializeRoutes(): void {
        console.log('heloo brotherrrrr')
        this.router.get('/signature',authController.getUploadSignature.bind(authController))
    }
}
