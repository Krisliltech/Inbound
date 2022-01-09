import { Response, NextFunction} from "express";
import { PrismaClient } from "@prisma/client";
import { RequestI } from "../interface";
import Joi from "joi";

const prisma = new PrismaClient()



async function auth( req: RequestI, res: Response, next: NextFunction){
    const schema = Joi.object({
        username: Joi.string().min(3).max(120).required().messages({
            "string.base": `"username" is invalid`,
            "string.empty": `"username" must contain value`,
            "string.min": `"username" must be at least 3 character long`,
            "string.max" : `"username" must not exceed 120 characters.`,
            "any.required": `"username" is missing`,
        }),
        auth_id: Joi.string().min(3).max(120).required().messages({
            "string.base": `"auth_id" is invalid`,
            "string.empty": `"auth_id" must contain value`,
            "string.min": `"auth_id" must be at least 3 character long`,
            "string.max" : `"auth_id" must not exceed 120 characters.`,
            "any.required": `"auth_id" is missing`,
        }),
        from: Joi.string().min(6).max(16).required().messages({
            "string.base": `"from" is invalid`,
            "string.empty": `"from" must contain value`,
            "string.min": `"from" must be at least 6 characters long`,
            "string.max" : `"from" must not exceed 16 characters.`,
            "any.required": `"from" is missing`,
        }),
        to: Joi.string().min(6).max(16).required().messages({
            "string.base": `"to" is invalid`,
            "string.empty": `"to" must contain value`,
            "string.min": `"to" must be at least 6 characters long`,
            "string.max" : `"to" must not exceed 16 characters.`,
            "any.required": `"to" is missing`,
        }),
        text: Joi.string().min(1).max(120).required().messages({
            "string.base": `"text" is invalid`,
            "string.empty": `"text" must contain value`,
            "string.min": `"text" must be at least 1 character long`,
            "string.max" : `"text" must not exceed 120 characters.`,
            "any.required": `"text" is missing`,
        }),
    
    });
    const validation = schema.validate(req.body);
    if(validation.error){
        return res.status(403).json({
            message:"",
            error: validation.error.message
        })
    }
    const {username, auth_id} = req.body;
    const user = await prisma.account.findFirst({
        where:{
            username,
            auth_id
        }
    })

    if(user){
        req.user = user;
        next()
    }else{
        return res.status(403).json({
            message:'',
            error: 'Invalid Credentials, check username and authId then try again.'
        })
    }
}

export default auth;