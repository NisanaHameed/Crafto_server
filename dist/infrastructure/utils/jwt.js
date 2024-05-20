"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class JWT {
    constructor() {
        this.authSecret = process.env.AUTH_SECRET || "";
    }
    generateToken(Id, role) {
        try {
            let payload = { Id, role };
            const token = jsonwebtoken_1.default.sign(payload, this.authSecret, { expiresIn: '30d' });
            return token;
        }
        catch (error) {
            console.error('Error while generating JWT token:', error);
            throw error;
        }
    }
    verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.authSecret);
            return decoded;
        }
        catch (err) {
            console.error('Error while verifying JWT token:', err);
            throw err;
        }
    }
}
exports.default = JWT;
