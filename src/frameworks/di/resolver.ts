import { container } from "tsyringe";
import { DependencyInjection } from "./index"
import { IAuthController } from "../../entities/controllerInterfaces/users/auth-controller.interface";
import { AuthController } from "../../interfaceAdapters/controllers/auth/auth_controller";
DependencyInjection.registerAll()

export const authController =
  container.resolve<IAuthController>(AuthController)

  // export const userController = 
  // container.resolve
  