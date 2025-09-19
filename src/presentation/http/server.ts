import { Application } from "express";
import helmet from "helmet";
import express from "express";
import rateLimit from "express-rate-limit";
import { config } from "../../shared/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { AuthRoutes } from "../routes/auth_route";
import { AdminRoutes } from "../routes/admin_route";
import { OwnerRoutes } from "../routes/turfOwner";
import { CloudinaryRoutes } from "../routes/cloudinary_route";
import { ClientRoutes } from "../routes/client_route";
import fs from "fs";
import path from "path";

// import { ExpressServer } from "../../app";

export class ExpressServer {
  private _app: Application;

  constructor() {
    this._app = express();
    this.configureMiddlewares();
    this.configureRoutes();
  }

  private configureMiddlewares(): void {
    this._app.use(helmet());
    this._app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 1000,
      })
    );
    this._app.use(
      cors({
        origin: config.cors.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
      })
    );

    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: true }));
    this._app.use(cookieParser());

     const logsDir = path.join(__dirname, "../shared/utils/logs");
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
    


    const logStream=fs.createWriteStream(
   path.join(logsDir,"access.log"),
   {flags:'a'}

   
  )
  this._app.use(morgan("dev"));
  this._app.use(morgan("combined", { stream: logStream }));
  }

  private configureRoutes(): void {
    this._app.use("/auth", new AuthRoutes().router);
    this._app.use("/_ad", new AdminRoutes().router);
    this._app.use("/_ow", new OwnerRoutes().router);
    this._app.use("/_cl", new ClientRoutes().router);
    this._app.use("/api/cloudinary", new CloudinaryRoutes().router);
  }

  public getApp(): Application {
    return this._app;
  }
  
}
