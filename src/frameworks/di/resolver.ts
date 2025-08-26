import { container } from "tsyringe";
import { DependencyInjection } from "./index";
import { IAuthController } from "../../entities/controllerInterfaces/users/auth-controller.interface";
import { AuthController } from "../../interfaceAdapters/controllers/auth/auth_controller";
import { IUserController } from "../../entities/controllerInterfaces/users/user-controller.interface";
import { UserController } from "../../interfaceAdapters/controllers/user_controller";
import { ITurfOwnerController } from "../../entities/controllerInterfaces/owner/owner-contoller.interface";
import { TurfOwnerController } from "../../interfaceAdapters/controllers/owner_controller";
DependencyInjection.registerAll();

export const authController =
  container.resolve<IAuthController>(AuthController);

export const userController =
  container.resolve<IUserController>(UserController);

  export const turfOwnerController = 
  container.resolve<ITurfOwnerController>(TurfOwnerController)

