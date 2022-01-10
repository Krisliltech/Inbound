import env from '../config/envConfig';
import * as redis from 'redis'

function connect(){

    const redisClientObj = redis.createClient({
            url: env.REDIS_HOST,
            password: env.REDIS_PASS
        })
    
        redisClientObj.connect();
        
        redisClientObj.on('connect', ()=>{
            console.log('redis connected successfully.')
        })
        redisClientObj.on('error', ()=>{
            console.log('redis unable to connect.')
        })
        return redisClientObj
}

export default connect




