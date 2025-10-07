import { container } from "tsyringe";
import { DependencyInjection } from "./index";
import { IAuthController } from "../../domain/controllerInterfaces/users/auth-controller.interface";
import { IUserController } from "../../domain/controllerInterfaces/users/user-controller.interface";
import { ITurfOwnerController } from "../../domain/controllerInterfaces/owner/owner-contoller.interface";
import { ITurfController } from "../../domain/controllerInterfaces/turf/turf_controller.interface";
import { TurfController } from "../controllers/turf_controller";
import { TurfOwnerController } from "../controllers/owner_controller";
import { UserController } from "../controllers/user_controller";
import { AuthController } from "../controllers/auth/auth_controller";
import { IBookingsController } from "../../domain/controllerInterfaces/bookings/bookings_controller_interface";
import { BookingsController } from "../controllers/bookings_controller";
DependencyInjection.registerAll();

export const authController =
  container.resolve<IAuthController>(AuthController);

export const userController =
  container.resolve<IUserController>(UserController);

  export const turfOwnerController = 
  container.resolve<ITurfOwnerController>(TurfOwnerController)

  export const turfController =
  container.resolve<ITurfController>(TurfController)

  export const bookingsController =
  container.resolve<IBookingsController>(BookingsController)

