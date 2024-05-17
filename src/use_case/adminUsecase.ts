import Admin from "../domain/admin";
import IAdminInterface from "./interface/IAdminInterface";
import JWT from "../infrastructure/utils/jwt";
import HashPassword from "../infrastructure/utils/hashPassword";
import Cloudinary from "../infrastructure/utils/cloudinary";
import StripePayment from "../infrastructure/utils/stripe";
import { unlink } from 'fs';
import { join } from 'path';

class AdminUsecase {

    private repository: IAdminInterface;
    private jwt: JWT;
    private hash: HashPassword;
    private cloudinary: Cloudinary;
    private stripe: StripePayment;

    constructor(repository: IAdminInterface, jwt: JWT, hash: HashPassword, cloudinary: Cloudinary, stripe: StripePayment) {
        this.repository = repository;
        this.jwt = jwt;
        this.hash = hash;
        this.cloudinary = cloudinary;
        this.stripe = stripe;
    }

    async login(email: string, password: string) {
        try {
            let findAdmin: any = await this.repository.findAdminByEmail(email);
            if (findAdmin) {
                let passwordCheck = await this.hash.compare(password, findAdmin.password);
                if (passwordCheck) {
                    let token = this.jwt.generateToken(findAdmin._id, 'admin')
                    return { success: true, adminData: findAdmin, token }
                } else {
                    return { success: false, message: "Incorrect password" }
                }
            } else {
                return { success: false, message: "Email not found" }
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    async getDashboard() {
        try {
            const subscriptions: any = await this.stripe.fetchSubscriptions();
            const revenue = subscriptions.data.reduce((acc: any, sub: any) => acc + sub?.plan?.amount * sub.quantity, 0);
            const revenueByDate = subscriptions.data.reduce((acc: any, sub: any) => {
                const date = new Date(sub.current_period_start * 1000).toLocaleDateString('en-US');
                const amount = (sub.plan.amount / 100) * sub.quantity;
                if (!acc[date]) {
                    acc[date] = 0;
                }
                acc[date] += amount;
                return acc;
            }, {});
            console.log('revenue', revenue)
            const totalRevenue = revenue / 100;
            const data = await this.repository.getDashboardDetails();
            const result = { ...data, totalRevenue, revenueByDate }
            return result;
        } catch (err) {
            throw err;
        }
    }
    async getUsers(page:number,limit:number) {
        try {
            let users = await this.repository.getUsers(page,limit);
            return users;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    async blockUser(id: string) {
        try {
            let blocked = await this.repository.blockUser(id);
            return blocked;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    async getProfessionals(page:number,limit:number) {
        try {
            let profs = await this.repository.getProfessionals(page,limit);
            return profs;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    async blockProfessional(id: string) {
        try {
            let blocked = await this.repository.blockProfessional(id);
            return blocked;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async addCategory(name: string, image: any) {
        try {
            let findCategory = await this.repository.findCategory(name);
            if (findCategory) {
                return { success: false, message: 'Category already exists!' };
            }
            let upload = await this.cloudinary.uploadToCloud(image);
            this.deleteImageFile(image.filename);
            let saveData = await this.repository.saveCategory(name, upload);
            return { success: true, saveData };
        } catch (err) {
            throw err
        }
    }

    async editCategory(id: string, name: string, image: any) {
        try {
            let findCategory = await this.repository.findCategory(name);
            if (findCategory && findCategory._id !== id) {
                return { success: false, message: 'Category name already exists!' };
            } else {
                let uploadedImage = await this.cloudinary.uploadToCloud(image);
                let edited = await this.repository.editCategory(id, name, uploadedImage);
                if (edited) {
                    return { success: true };
                } else {
                    return { success: false, message: 'Category is not added!' };
                }
            }
        } catch (err) {
            throw err;
        }
    }

    async deleteImageFile(filename: any) {
        const imagePath = join(__dirname, '../infrastructure/public/images', filename);
        unlink(imagePath, (err: any) => {
            if (err) {
                console.log("Error deleting image.." + err);
            } else {
                console.log('image deleted');
            }
        })
    }

    async addJobrole(name: string) {
        try {
            let findJobrole = await this.repository.findJobrole(name);
            if (findJobrole) {
                return { success: false, message: 'Jobrole already exists!' };
            }
            let saveData = await this.repository.saveJobrole(name);
            return { success: true, saveData };
        } catch (err) {
            throw err;
        }
    }

    async getCategory() {
        try {
            let categories = await this.repository.getCategory();
            return categories;
        } catch (err) {
            throw err;
        }
    }

    async getJobrole() {
        try {
            let jobrole = await this.repository.getJobrole();
            return jobrole
        } catch (err) {
            throw err;
        }
    }

    async deleteJobrole(id: string) {
        try {
            let res = await this.repository.deleteJobrole(id);
            return res;
        } catch (err) {
            throw err;
        }
    }

    async editJobrole(id: string, name: string) {
        try {
            let findJobrole = await this.repository.findJobrole(name);
            if (findJobrole && findJobrole._id == id) {
                return { success: false, message: 'This is same category name!' };
            } else if (findJobrole) {
                return { success: false, message: 'Jobrole already exists!' };
            }
            let res = await this.repository.editJobrole(id, name);
            return { success: true, res };
        } catch (err) {
            throw err;
        }
    }

    async getSubscriptions() {
        try {
            const data = await this.repository.getSubscriptions();
            return data;
        } catch (err) {
            throw err;
        }
    }

    async getASubscription(id: string) {
        try {
            const data = await this.repository.getASubscription(id);
            return data;
        } catch (err) {
            throw err;
        }
    }
}

export default AdminUsecase;