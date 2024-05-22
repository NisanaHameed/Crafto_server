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
Object.defineProperty(exports, "__esModule", { value: true });
class AdminController {
    constructor(usecase) {
        this.usecase = usecase;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                let data = yield this.usecase.login(email, password);
                if (data.success) {
                    res.cookie('adminToken', data.token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true,
                        sameSite: 'none',
                        secure: true
                    });
                    res.status(200).json(data);
                }
                else {
                    res.status(401).json(data);
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.usecase.getDashboard();
                res.status(200).json({ success: true, data });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let page = req.query.page || 1;
                let limit = parseInt(req.query.limit);
                let users = yield this.usecase.getUsers(page, limit);
                if (users) {
                    res.status(200).json({ success: true, users: users.users, total: users.total });
                }
                else {
                    res.status(500).json({ success: false, message: "Internal server error" });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    blockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = req.params.id;
                let blocked = yield this.usecase.blockUser(userId);
                if (blocked) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(200).json({ success: false, message: "Internal server error" });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getProfessionals(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let page = req.query.page || 1;
                let limit = parseInt(req.query.limit);
                let profs = yield this.usecase.getProfessionals(page, limit);
                if (profs) {
                    res.status(200).json({ success: true, profs: profs.professionals, total: profs.total });
                }
                else {
                    res.status(200).json({ success: false, message: "Internal server error" });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    blockProfessional(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let profId = req.params.id;
                let blocked = yield this.usecase.blockProfessional(profId);
                if (blocked) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(500).json({ success: false, message: "Internal server error" });
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    addCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let category = req.body.name;
                let image = req.file;
                let savedData = yield this.usecase.addCategory(category, image);
                if (savedData.success) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(500).json({ success: false, message: savedData.message });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: "Internal server error!" });
            }
        });
    }
    editCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id, name } = req.body;
                let image = req.file;
                let result = yield this.usecase.editCategory(id, name, image);
                if (result.success) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(500).json({ success: false, message: result.message });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    addJobrole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let name = req.body.name;
                let savedData = yield this.usecase.addJobrole(name);
                if (savedData.success) {
                    res.status(200).json({ success: true });
                }
                else if (!savedData.success) {
                    res.status(500).json({ success: false, message: savedData.message });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: "Internal server error!" });
            }
        });
    }
    getCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.usecase.getCategory();
                res.status(200).json({ success: true, categories });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getJobrole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobroles = yield this.usecase.getJobrole();
                res.status(200).json({ success: true, jobroles });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    deleteJobrole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.params.id;
                let deleted = yield this.usecase.deleteJobrole(id);
                if (deleted) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(500).json({ success: false, message: 'Something went wrong!' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    editJobrole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id, name } = req.body;
                let saved = yield this.usecase.editJobrole(id, name);
                if (saved.success) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(500).json({ success: false, message: saved.message });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: err });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie('adminToken', '', {
                    httpOnly: true,
                    expires: new Date(0)
                });
                res.status(200).json({ success: true });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getSubscriptions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscriptions = yield this.usecase.getSubscriptions();
                res.status(200).json({ success: true, subscriptions });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    getASubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            try {
                const subscription = yield this.usecase.getASubscription(id);
                res.status(200).json({ success: true, subscription });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
}
exports.default = AdminController;
