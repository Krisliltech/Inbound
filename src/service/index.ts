import { PrismaClient } from "@prisma/client";
import { Express, Response } from "express";
import { RequestI as Request } from "../interface";
import  redisConnect  from "../redis";
import authenticate from '../auth'

const prisma = new PrismaClient();
const redisClient = redisConnect();

function service(app: Express){
    app.post('/inbound/sms', authenticate, async (req: Request, res: Response)=>{
       try{
        const { id } = req.user!
        const { to, from, text } = req.body;
        const phone_number = await prisma.phone_number.findFirst({
            where:{
                account_id: id,
                number: to
            }
        })

        if(!phone_number){
            return res.status(404).json({
                message: '',
                error: `'to' parameter not found.`
            })
        }
        const stops = [
            'STOP',
            'STOP\n',
            'STOP\r',
            'STOP\r\n'
        ]
        if(stops.includes(text)){
            const key = `${to}${from}`;
            const value = JSON.stringify({
                to,
                from
            })
            redisClient.set(key, value)
            redisClient.expire(key, 4 * 3600)
        }
     
         res.json({
             'message': 'inbound sms ok',
              'error': ""
            })

       }catch(error){
        return res.status(500).json({
            message: "",
            error: "Unknown failure"
        })
       }
      
    });

    app.use('*', async (req: Request, res: Response)=>{
        
        res.status(405).json({
            message:"",
            error:"Invalid route."
        })

    })
}

export default service