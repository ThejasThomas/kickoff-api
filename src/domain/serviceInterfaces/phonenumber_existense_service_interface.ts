export interface IPhoneNumberExistenceService{
    phoneNumberExists(phoneNumber:string):Promise<boolean>
}