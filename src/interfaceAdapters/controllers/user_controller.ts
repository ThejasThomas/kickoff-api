// import { success } from "zod"
// import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants"
// import { CustomRequest } from "../middlewares/auth_middleware"

// async refreshSession(req:Request,res:Response) : Promise<void> {
//     try{
//         const {userId,role} = (req as CustomRequest).user;
//         if(!userId || !role) {
//             res.status(HTTP_STATUS.UNAUTHORIZED).json({
//                 success:false,
//                 message:ERROR_MESSAGES.INVALID_TOKEN
//             })
//             return;
//         }
//     }
// }