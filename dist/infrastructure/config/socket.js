"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const profModel_1 = __importDefault(require("../database/profModel"));
function socketServer(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: '*'
        }
    });
    let users = [];
    const addUser = (userId, socketId) => {
        console.log('in add user', userId);
        const existingUser = users.find(user => user.userId === userId);
        if (existingUser) {
            existingUser.socketId = socketId;
            existingUser.online = true;
        }
        else {
            users.push({ userId, socketId, online: true });
        }
        io.emit('userOnline', users.filter(user => user.online));
    };
    const removeUser = (socketId) => __awaiter(this, void 0, void 0, function* () {
        const user = users.find(user => user.socketId === socketId);
        if (user) {
            user.online = false;
        }
        io.emit('userOnline', users.filter(user => user.online));
    });
    const getUser = (userId) => users.find(user => user.userId === userId);
    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);
        socket.on('addUser', (userId) => {
            console.log(userId);
            addUser(userId, socket.id);
            io.emit('getUsers', users);
        });
        socket.on('sendMessage', ({ senderId, receiverId, text, createdAt }) => {
            console.log(users);
            console.log(senderId, receiverId, text);
            const user = getUser(receiverId);
            console.log('user', user);
            if (user) {
                io.to(user.socketId).emit('getMessage', { senderId, text, createdAt });
            }
        });
        socket.on('disconnect', () => {
            removeUser(socket.id).catch(err => console.log('error occured during removal of user'));
            io.emit('userOnline', users.filter(user => user.online));
        });
        socket.on('pushNotification', (_a) => __awaiter(this, [_a], void 0, function* ({ requirement, message }) {
            console.log('first one', requirement, message);
            let job;
            if (requirement.service === 'Home construction') {
                job = 'Constructor';
            }
            else if (requirement.service === 'Interior design') {
                job = 'Interior Designer';
            }
            else if (requirement.service === 'House plan') {
                job = 'Architect';
            }
            const professionals = yield profModel_1.default.find({ job: job, isVerified: true });
            console.log('professionals', professionals);
            professionals.forEach((prof) => {
                console.log('prof', prof);
                console.log('profId', prof._id);
                const user = getUser(prof._id.toString());
                console.log('user', user);
                if (user && user.socketId) {
                    io.to(user.socketId).emit('getNotification', { user, message });
                }
            });
        }));
    });
}
exports.default = socketServer;
