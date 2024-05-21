import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRoute from '../route/userRoute'
import professionalRoute from '../route/profRoute'
import adminRoute from '../route/adminRoute'
import chatRoute from '../route/chatRoute'
import socketServer from './socket'
import http from 'http'

export const createServer = () => {
    try {
        const app = express()
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        app.use(cookieParser())

        app.use(
            cors({
                origin: ['https://crafto-one.vercel.app'],
                methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
                credentials: true,
                optionsSuccessStatus:200
            })
        )

       
        app.use('/api/', userRoute);
        app.use('/api/professional',professionalRoute);
        app.use('/api/admin',adminRoute);
        app.use('/api/chat',chatRoute);

        const server = http.createServer(app);
        socketServer(server);

        app.use((req, res) => {
            res.status(404).send('It is Not Found');
        });
        
        return server;

    } catch (err) {
        console.log(err);
    }
}