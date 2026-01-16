import { NextFunction, Request, Response } from "express";
import {auth as betterAuth} from '../lib/auth'

export enum UserRole{
    ADMIN="ADMIN",
    USER="USER"
}

declare global{
    namespace Express{
        interface Request{
            user?:{
                id:string,
                name:string,
                email:string,
                role:string
            }
        }
    }
}


const auth=(...roles:UserRole[])=>{
        return async(req:Request,res:Response,next:NextFunction)=>{
            try {
                const session= await betterAuth.api.getSession({
                    headers:req.headers as any
                })
                // console.log(session)
                if(!session){
                    res.status(404).json({
                        message:'unauthorized access'
                    })
                }
                  if (!session?.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: "Email verification required. Please verfiy your email!"
                })
                
            }
            req.user={
                    id:session?.user.id as string,
                    name:session?.user.name as string,
                    email:session?.user.email as string,
                    role:session?.user.role as string,
                }
                if(roles.length&&!roles.includes(req.user.role as UserRole)){
                    return res.status(403).json({
                    success: false,
                    message: "Forbidden! You don't have permission to access this resources!"
                })
                }
                next()
            } catch (error) {
                next(error)
            }
        }
}
export default auth