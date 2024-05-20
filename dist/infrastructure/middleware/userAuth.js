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
const jwt_1 = __importDefault(require("../utils/jwt"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRepository_1 = __importDefault(require("../repository/userRepository"));
const repository = new userRepository_1.default();
const jwt = new jwt_1.default();
dotenv_1.default.config();
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.cookies.userToken;
    console.log('token...', token);
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verifyToken(token);
        console.log('decoded....', decoded);
        if (decoded && decoded.role !== 'user') {
            return res.status(401).send({ success: false, message: "Unauthorized" });
        }
        if (decoded && decoded.Id) {
            let user = yield repository.findUserById(decoded.Id);
            if (user === null || user === void 0 ? void 0 : user.isBlocked) {
                return res.status(401).send({ success: false, message: "User is blocked by admin!" });
            }
            else {
                req.userId = decoded.Id;
                next();
            }
        }
        else {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Session has expired, please log in again." });
        }
        return res.status(401).send({ success: false, message: "Unauthorized" });
    }
});
exports.default = userAuth;
