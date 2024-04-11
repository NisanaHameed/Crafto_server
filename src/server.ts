import { createServer } from './infrastructure/config/app';
import { connectDb } from './infrastructure/config/connectDb';
import MessageRepository from './infrastructure/repository/messageRepository';
import dotenv from 'dotenv';
import { Server } from 'socket.io'
import http from 'http'
dotenv.config()
const chat = new MessageRepository();


const startServer = async () => {
    try {
        await connectDb();
        // const app = createServer();
        // const server = http.createServer(app);
        // const io = new Server(server, {
        //     cors: {
        //         origin: 'http://localhost:5173',
        //         methods: ['GET', 'POST']
        //     }
        // });

        // io.on('connection', (socket) => {
        //     console.log('socket client connected', socket.id);

        //     socket.on('send_message', async (data) => {
        //         await chat.saveMessage(data);
        //         socket.emit('received_message', data)
        //         console.log(data)
        //     })
        // })
        const app = createServer();
        app?.listen(3000, () => {
            console.log('server is running on port 3000')
        })


    } catch (err) {
        console.log(err);
    }
}

startServer();