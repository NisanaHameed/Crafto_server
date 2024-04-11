import { Server, Socket } from 'socket.io'
import http from 'http'
import { createServer } from './app'

interface User {
    userId: string,
    socketId: string,
    online?: boolean
}

function socketServer(server: any) {

    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173'],
            methods: ['GET', 'POST']
        }
    });

    let users: User[] = [];

    const addUser = (userId: string, socketId: string) => {
        console.log('in add user', userId)
        const existingUser = users.find(user => user.userId === userId);
        if (existingUser) {
            existingUser.socketId = socketId;
            existingUser.online = true;
        } else {
            users.push({ userId, socketId, online: true });
        }
        io.emit('userOnline', users.filter(user => user.online))
    }

    const removeUser = async (socketId: string) => {
        const user = users.find(user => user.socketId === socketId)
        if (user) {
            user.online = false;
        }

        io.emit('userOnline', users.filter(user => user.online))
    }

    const getUser = (userId: string) => users.find(user => user.userId === userId)

    io.on('connection', (socket: Socket) => {

        console.log('a user connected', socket.id);

        socket.on('addUser', (userId) => {
            console.log(userId)
            addUser(userId, socket.id)
            io.emit('getUsers', users)
        })

        socket.on('sendMessage', ({ senderId, receiverId, text }) => {
            console.log(users)
            console.log(senderId, receiverId, text)
            const user = getUser(receiverId);
            console.log('user', user)
            if (user) {
                io.to(user.socketId).emit('getMessage', { senderId, text })
            }
        })

        socket.on('disconnect', () => {
            removeUser(socket.id).catch(err => console.log('error occured during removal of user'))
            io.emit('userOnline', users.filter(user => user.online));
        })
    })
}

export default socketServer;