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
class RequirementController {
    constructor(usecase) {
        this.usecase = usecase;
    }
    saveRequirement(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.userId;
                let reqs = req.body;
                reqs.userId = id;
                reqs.createdAt = Date.now();
                let result = yield this.usecase.saveReq(reqs);
                if (result) {
                    res.status(200).json({ success: true, requirement: result });
                }
                else {
                    res.status(500).json({ success: false, message: 'Internal server error' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    getRequirements(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = req.userId;
                let reqs = yield this.usecase.getRequirements(userId);
                res.status(200).json({ success: true, reqs });
            }
            catch (err) {
                res.status(500).json({ success: false, message: err });
            }
        });
    }
    updateRequirement(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.body.id;
                let status = req.body.status;
                let edited = yield this.usecase.updateReq(id, status);
                if (edited) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(500).json({ success: false, message: 'Failed to update requirement!' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getRequirementsByService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let profId = req.profId;
                const requirements = yield this.usecase.getRequirementsByService(profId);
                res.status(200).json({ success: true, requirements });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
}
exports.default = RequirementController;
