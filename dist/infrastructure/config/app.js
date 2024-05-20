"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoute_1 = __importDefault(require("../route/userRoute"));
const profRoute_1 = __importDefault(require("../route/profRoute"));
const adminRoute_1 = __importDefault(require("../route/adminRoute"));
const chatRoute_1 = __importDefault(require("../route/chatRoute"));
const socket_1 = __importDefault(require("./socket"));
const http_1 = __importDefault(require("http"));
const createServer = () => {
    try {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use((0, cookie_parser_1.default)());
        app.use((0, cors_1.default)({
            origin: ['https://crafto-one.vercel.app'],
            methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
            credentials: true
        }));
        app.use('/api/', userRoute_1.default);
        app.use('/api/professional', profRoute_1.default);
        app.use('/api/admin', adminRoute_1.default);
        app.use('/api/chat', chatRoute_1.default);
        const server = http_1.default.createServer(app);
        (0, socket_1.default)(server);
        app.use((req, res) => {
            res.status(404).send('It is Not Found');
        });
        return server;
    }
    catch (err) {
        console.log(err);
    }
};
exports.createServer = createServer;
