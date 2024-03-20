import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import userRoute from '../route/userRoute'
import professionalRoute from '../route/profRoute'
import adminRoute from '../route/adminRoute'

export const createServer = () => {
    try {
        const app = express()
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        app.use(cookieParser())

        //cors
        app.use(
            cors({
                origin: 'http://localhost:5173',
                methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
                credentials: true
            })
        )

       
        app.use('/api/', userRoute);
        app.use('/api/professional',professionalRoute);
        app.use('/api/admin',adminRoute);

        app.use((req, res) => {
            res.status(404).send('It is Not Found');
        });
        
        return app;

    } catch (err) {
        console.log(err);
    }
}