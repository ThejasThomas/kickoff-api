import { Application } from "express";
import { inject } from "tsyringe";
import helmet from 'helmet';
import express from 'express'
import rateLimit from 'express-rate-limit'
import { config } from "../../shared/config";
import cors from 'cors'
import cookieParser from "cookie-parser"
import morgan from 'morgan'
import { MongoConnect } from "../database/mongoDb/mongoConnect";
import { AuthRoutes } from "../routes/auth_route";
import { AdminRoutes } from "../routes/admin_route";
import { OwnerRoutes } from "../routes/turfOwner";
// import { ExpressServer } from "../../app";

export class ExpressServer {
 private _app:Application;

 constructor(){
    this._app =express();
    this.configureMiddlewares()
    this.configureRoutes();
    
   
 }

 private configureMiddlewares():void {
    this._app.use(helmet())
    this._app.use(
        rateLimit({
            windowMs:15*60*1000,
            max:1000,
        })
    );
  this._app.use(
  cors({
    origin: config.cors.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

    this._app.use(express.json())
    this._app.use(express.urlencoded({extended:true}))
    this._app.use(cookieParser())
    this._app.use(morgan('dev'))
 }

 private configureRoutes(): void {
    this._app.use('/auth',new AuthRoutes().router)
    this._app.use('/_ad',new AdminRoutes().router)
    this._app.use('/_ow',new OwnerRoutes().router)

 }

 public getApp():Application {
    return this._app;
 }
 }

