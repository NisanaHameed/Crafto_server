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
const requirementModel_1 = __importDefault(require("../database/requirementModel"));
const notificationModel_1 = __importDefault(require("../database/notificationModel"));
const profModel_1 = __importDefault(require("../database/profModel"));
class RequirementRepository {
    saveRequirement(requirement) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newReq = new requirementModel_1.default(requirement);
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
                const notifications = professionals.map(prof => {
                    return new notificationModel_1.default({
                        userId: prof._id,
                        message: 'You have a new requirement, check the details!',
                        createdAt: Date.now(),
                        category: 'Requirement'
                    });
                });
                yield notificationModel_1.default.insertMany(notifications);
                yield newReq.save();
                // await ProfModel.updateMany({ job: job, isVerified: true }, { $addToSet: { requirements: newReq._id } });
                return newReq;
            }
            catch (err) {
                throw new Error('Failed to save requirement');
            }
        });
    }
    getRequirements(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield requirementModel_1.default.find({ userId: userId }).sort({ createdAt: -1 });
                return res;
            }
            catch (err) {
                throw new Error('Failed to fetch requirements');
            }
        });
    }
    updateRequirement(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield requirementModel_1.default.updateOne({ _id: id }, { $set: { status: status } });
                return res.acknowledged;
            }
            catch (err) {
                throw new Error('Failed to update requirement');
            }
        });
    }
    getRequirementsByService(profId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prof = yield profModel_1.default.findOne({ _id: profId });
                let service;
                if ((prof === null || prof === void 0 ? void 0 : prof.job) == 'Architect') {
                    service = 'House plan';
                }
                else if ((prof === null || prof === void 0 ? void 0 : prof.job) == 'Interior Designer') {
                    service = 'Interior design';
                }
                else if ((prof === null || prof === void 0 ? void 0 : prof.job) == 'Constructor') {
                    service = 'Home construction';
                }
                const requirements = yield requirementModel_1.default.find({ service: service }).sort({ createdAt: -1 });
                return requirements;
            }
            catch (err) {
                throw new Error('Failed to fetch requirements!');
            }
        });
    }
}
exports.default = RequirementRepository;
