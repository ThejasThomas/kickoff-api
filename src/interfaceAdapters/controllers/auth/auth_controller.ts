import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import "reflect-metadata";

import { IAuthController } from "../../../entities/controllerInterfaces/users/auth-controller.interface";
import { IRegisterUserUseCase } from "../../../entities/useCaseInterfaces/auth/register_usecase_interface";
import { IVerifyOtpUseCase } from "../../../entities/useCaseInterfaces/auth/verify_otp_usecase_interface";
import { ISendOtpEmailUseCase } from "../../../entities/useCaseInterfaces/auth/sent_otp_usecase_interface";
import { ILoginUserUseCase } from "../../../entities/useCaseInterfaces/auth/login_usecase_interface";
// import { IBlackListTokenUseCase } from "../../../entities/useCaseInterfaces/auth/blacklist_token_usecase_interface";
// import { IRevokeRefreshTokenUseCase } from "../../../entities/useCaseInterfaces/auth/revoke_refresh_token_usecase.interface";
// import { IForgotPasswordUseCase } from "../../../entities/useCaseInterfaces/auth/forgot_password_usecase_interface";
// import { IGoogleUseCase } from "../../../entities/useCaseInterfaces/auth/google_usecase";
// import { IResetPasswordUseCase } from "../../../entities/useCaseInterfaces/auth/reset_password_usecase_interface";

import { userSchema } from "./validations/user_signup_validation_schema";
import { loginSchema } from "./validations/user_login_validation_schema";

import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../shared/constants";
import { LoginUserDTO } from "../../../shared/dtos/user_dto";
import { handleErrorResponse } from "../../../shared/utils/error_handler";
import {
  clearAuthCookies,
  setAuthCookies,
  updateCookieWithAccessToken,
} from "../../../shared/utils/cookie_helper";
import { IGenerateTokenUseCase } from "../../../entities/useCaseInterfaces/auth/generate_token_usecase_interface";
import { otpMailValidationSchema } from "./validations/otp_mail_validation_schema";
import { success } from "zod";
import { CustomRequest } from "../../middlewares/auth_middleware";
import { IRefreshTokenUseCase } from "../../../entities/useCaseInterfaces/auth/refresh_token_usecase_interface";
import { IGoogleUseCase } from "../../../entities/useCaseInterfaces/auth/google_usecase";
import { use } from "react";
import { forgotPasswordValidationSchema } from "./validations/forgot_password_validation_schema";
import { IForgotPasswordUseCase } from "../../../entities/useCaseInterfaces/auth/forgot_password_usecase_interface";
import { resetPasswordValidationSchema } from "./validations/reset_password_validation_schema";
import { IResetPasswordUseCase } from "../../../entities/useCaseInterfaces/auth/reset_password_usecase_interface";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject("IRegisterUserUseCase")
    private _registerUserUseCase: IRegisterUserUseCase,
    @inject("IVerifyOtpUseCase") private _verifyOtpUseCase: IVerifyOtpUseCase,
    @inject("ISendOtpEmailUseCase")
    private _sendOtpEmailUseCase: ISendOtpEmailUseCase,
    @inject("ILoginUserUseCase") private _loginUserUseCase: ILoginUserUseCase,
    @inject("IGenerateTokenUseCase")
    private _generateTokenUseCase: IGenerateTokenUseCase,
    @inject("IRefreshTokenUseCase")
    private _refreshTokenUseCase: IRefreshTokenUseCase,
    @inject("IGoogleUseCase") private _googleUseCase: IGoogleUseCase,
    @inject("IForgotPasswordUseCase")
    private _forgotPasswordUseCase: IForgotPasswordUseCase,
    @inject("IResetPasswordUseCase")
    private _resetPasswordUseCase: IResetPasswordUseCase
  ) {}

  // 🛠️ User Register
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { role } = req.body as { role: keyof typeof userSchema };
      const schema = userSchema[role];
      if (!schema) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        });
        return;
      }
      const validatedData = schema.parse(req.body);
      await this._registerUserUseCase.execute(validatedData);

      if (role === "turfOwner") {
        res.status(HTTP_STATUS.CREATED).json({
          success: true,
          message: SUCCESS_MESSAGES.LOGIN_AND_COMPLETE_YOUR_PROFILE,
        });
        return;
      }

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  // 🛠️ User Login
  async login(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body as LoginUserDTO;
      const validatedData = loginSchema.parse(data);

      if (!validatedData) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        });
        return;
      }

      const user = await this._loginUserUseCase.execute(validatedData);

      if (!user.userId || !user.email || !user.role) {
        throw new Error("User ID, email, or role is missing");
      }

      const tokens = await this._generateTokenUseCase.execute(
        user.userId as string,
        user.email,
        user.role
      );

      const accessTokenName = `${user.role}_access_token`;
      const refreshTokenName = `${user.role}_refresh_token`;

      setAuthCookies(
        res,
        tokens.accessToken,
        tokens.refreshToken,
        accessTokenName,
        refreshTokenName
      );

      const { password, ...userWithoutPassword } = user;

      if (
        ["pending", "rejected"].includes(
          userWithoutPassword.status as string
        ) &&
        userWithoutPassword.role === "turfOwner"
      ) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.PENDING_ADMIN_APPROVAL,
          user: userWithoutPassword,
        });
        return;
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        user: userWithoutPassword,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  // 🛠️ Send OTP Email
  async sendOtpEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this._sendOtpEmailUseCase.execute(email);
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.OTP_SEND_SUCCESS,
        success: true,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      const validatedData = otpMailValidationSchema.parse({ email, otp });
      await this._verifyOtpUseCase.execute(validatedData);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.VERIFICATION_SUCCESS,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
  handleTokenRefresh(req: Request, res: Response): void {
    try {
      const refreshToken = (req as CustomRequest).user.refresh_token;
      const newTokens = this._refreshTokenUseCase.execute(refreshToken);
      const accessTokenName = `${newTokens.role}_access_token`;
      updateCookieWithAccessToken(res, newTokens.accessToken, accessTokenName);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.OPERATION_SUCCESS,
      });
    } catch (error) {
      clearAuthCookies(
        res,
        `${(req as CustomRequest).user.role}_access_token`,
        `${(req as CustomRequest).user.role}_refresh_token`
      );
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: ERROR_MESSAGES.INVALID_TOKEN,
      });
    }
  }

  async authenticateWithGoogle(req: Request, res: Response): Promise<void> {
    try {
      const { credential, client_id, role } = req.body;
      const user = await this._googleUseCase.execute(
        credential,
        client_id,
        role
      );
      if (!user.userId || !user.email || !user.role) {
        throw new Error("User ID ,email or role is missing");
      }

      const tokens = await this._generateTokenUseCase.execute(
        user.userId,
        user.email,
        user.role
      );

      const accessTokenName = `${user.role}_access_token`;
      const refreshTokenName = `${user.role}_refresh_token`;

      setAuthCookies(
        res,
        tokens.accessToken,
        tokens.refreshToken,
        accessTokenName,
        refreshTokenName
      );
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        user: user,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = forgotPasswordValidationSchema.parse(req.body);
      if (!validatedData) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.VALIDATION_ERROR,
        });
        return;
      }
      await this._forgotPasswordUseCase.execute(validatedData);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.EMAIL_SENT_SUCCESSFULLY,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = resetPasswordValidationSchema.parse(req.body);
      if (!validatedData) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.VALIDATION_ERROR,
        });
      }

      await this._resetPasswordUseCase.execute(validatedData);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
}
