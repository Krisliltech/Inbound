import express from 'express';
import {config} from "dotenv"
import service from './service'


config(); // activate access to environment variables.


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

service(app);


const PORT = process.env.PORT!
app.listen(PORT, ()=>{
    console.log(`Server now running on port ${PORT}`)
})