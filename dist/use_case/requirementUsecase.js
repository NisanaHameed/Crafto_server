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
class RequirementUsecase {
    constructor(repository) {
        this.repository = repository;
    }
    saveReq(reqrmnt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.repository.saveRequirement(reqrmnt);
                return res;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getRequirements(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.repository.getRequirements(userId);
                return res;
            }
            catch (err) {
                throw err;
            }
        });
    }
    updateReq(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.repository.updateRequirement(id, status);
                return res;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getRequirementsByService(profId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const requirements = yield this.repository.getRequirementsByService(profId);
                return requirements;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = RequirementUsecase;
