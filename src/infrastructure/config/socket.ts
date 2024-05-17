import { Server, Socket } from 'socket.io'
import ProfModel from '../database/profModel'

interface User {
    userId: string,
    socketId: string,
    online?: boolean
}

function socketServer(server: any) {

    const io = new Server(server, {
        cors: {
            origin: '*',
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

        socket.on('sendMessage', ({ senderId, receiverId, text, createdAt }) => {
            console.log(users)
            console.log(senderId, receiverId, text)
            const user = getUser(receiverId);
            console.log('user', user)
            if (user) {
                io.to(user.socketId).emit('getMessage', { senderId, text, createdAt })
            }
        })

        socket.on('disconnect', () => {
            removeUser(socket.id).catch(err => console.log('error occured during removal of user'))
            io.emit('userOnline', users.filter(user => user.online));
        })

        socket.on('pushNotification', async ({ requirement, message }) => {
            console.log('first one', requirement, message);
            let job;
            if (requirement.service === 'Home construction') {
                job = 'Constructor';
            } else if (requirement.service === 'Interior design') {
                job = 'Interior Designer';
            } else if (requirement.service === 'House plan') {
                job = 'Architect'
            }
            const professionals: any = await ProfModel.find({ job: job, isVerified: true });
            console.log('professionals', professionals)
            professionals.forEach((prof: any) => {
                console.log('prof', prof)
                console.log('profId', prof._id)
                const user = getUser(prof._id.toString());
                console.log('user', user)
                if (user && user.socketId) {
                    io.to(user.socketId).emit('getNotification', { user, message });
                }
            });
        })
    })
}

export default socketServer;