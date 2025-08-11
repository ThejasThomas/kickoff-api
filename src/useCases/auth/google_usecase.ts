import { inject, injectable } from "tsyringe";
import { IGoogleUseCase } from "../../entities/useCaseInterfaces/auth/google_usecase";
import { OAuth2Client } from "google-auth-library";
import { IRegisterUserUseCase } from "../../entities/useCaseInterfaces/auth/register_usecase_interface";
import { IClientRepository } from "../../entities/repositoryInterface/users/client-repository.interface";
import { ITurfOwnerRepository } from "../../entities/repositoryInterface/users/turf_owner-repository.interface";
import { IClientEntity } from "../../entities/models/client_entity";
import { ITurfOwnerEntity } from "../../entities/models/turfOwner_entity";
import { ERROR_MESSAGES, GOOGLE_REGISTRATION_MAIL_CONTENT, HTTP_STATUS, TRole } from "../../shared/constants";
import { CustomError } from "../../entities/utils/custom.error";
import { generateRandomPassword } from "../../shared/utils/random_password_helper";
import { ClientDTO } from "../../shared/dtos/user_dto";
import { ISendEmailUseCase } from "../../entities/useCaseInterfaces/common/send_email_usecase_interface";

@injectable()
export class GoogleUseCase implements IGoogleUseCase {
    private _oAuthClient:OAuth2Client;
    constructor(
        @inject('IRegisterUserUseCase')
        private _registerUserUseCase:IRegisterUserUseCase,
        @inject('IClientRepository')
        private _clientRepository:IClientRepository,
        @inject('ITurfOwnerRepository')
        private _turfOwnerRepository:ITurfOwnerRepository,
        @inject('ISendEmailUseCase')
        private _sendEmailUseCase:ISendEmailUseCase

    ){
        this._oAuthClient=new OAuth2Client()
    }

    async execute(credential: string, client_id: string, role: TRole): Promise<Partial<ITurfOwnerEntity | IClientEntity>> {
        const ticket=await this._oAuthClient.verifyIdToken({
            idToken:credential,
            audience:client_id,
        })

        const payload =ticket.getPayload();
        if(!payload){
            throw new CustomError(
                'Invalid or empty token payload',
                HTTP_STATUS.UNAUTHORIZED
            )
        }
        const googleId=payload.sub;
        const email =payload.email;
        const fullName=payload.given_name || payload.family_name || "";

        if(!email){
            throw new CustomError('Email is required',HTTP_STATUS.BAD_REQUEST)
        }
        let repository;
        if(role==='client') {
            repository =this._clientRepository;
        } else if (role ==='turfOwner') {
            repository =this._turfOwnerRepository
        } else {
            throw new CustomError(
                ERROR_MESSAGES.INVALID_ROLE,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        const existingUser = await repository.findOne({email});

        if(existingUser) {
            if(existingUser.status!=='active') {
                if(existingUser.status ==='pending') {
                    throw new CustomError(
                        ERROR_MESSAGES.ACCOUNT_UNDER_VERIFICATION,
                        HTTP_STATUS.FORBIDDEN
                    )
                }
                throw new CustomError(
                    ERROR_MESSAGES.BLOCKED,
                    HTTP_STATUS.FORBIDDEN
                )
            }
            return existingUser;
        }
        if(role === 'turfOwner') {
            throw new CustomError(
                "TurfOwner cannot be created using google.Please Register First.",
                HTTP_STATUS.FORBIDDEN,
            )
        }

        const tempPassword=(
            await generateRandomPassword(fullName,email)
        ).trim()

        const userData:ClientDTO = {
            fullName,
            role,
            googleId,
            email,
            phoneNumber:"",
            password:tempPassword,
        }

        const newUser=await this._registerUserUseCase.execute(
            userData,
        )

        if(!newUser) {
            throw new CustomError(
                "Registration failed",
                HTTP_STATUS.INTERNAL_SERVER_ERROR
            )
        }

        this._sendEmailUseCase.execute(
            email,
            "Welcome To KickOFF! Your Google Registration is complete 🎉",
            GOOGLE_REGISTRATION_MAIL_CONTENT(fullName,tempPassword)
        )
        return newUser;
    }
}