import Admin from "../domain/admin";
import IAdminInterface from "./interface/IAdminInterface";
import JWT from "../infrastructure/utils/jwt";
import HashPassword from "../infrastructure/utils/hashPassword";
import Cloudinary from "../infrastructure/utils/cloudinary";

class AdminUsecase {

    private repository: IAdminInterface;
    private jwt: JWT;
    private hash: HashPassword;
    private cloudinary:Cloudinary

    constructor(repository: IAdminInterface, jwt: JWT, hash: HashPassword,cloudinary:Cloudinary) {
        this.repository = repository;
        this.jwt = jwt;
        this.hash = hash;
        this.cloudinary = cloudinary;
    }

    async login(email: string, password: string) {
        try {
            let findAdmin: any = await this.repository.findAdminByEmail(email);
            if (findAdmin) {
                let passwordCheck = await this.hash.compare(password, findAdmin.password);
                if (passwordCheck) {
                    let token = JWT.generateToken(findAdmin._id, 'admin')
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
    async getUsers() {
        try {
            let users = await this.repository.getUsers();
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
    async getProfessionals() {
        try {
            let profs = await this.repository.getProfessionals();
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

    async addCategory(name:string,image:any){
        try{
            let upload = await this.cloudinary.uploadToCloud(image);
            let saveData = await this.repository.saveCategory(name,upload);
            return saveData;
        }catch(err){
            throw err
        }
    }
    async addJobrole(name:string){
        try{
            let saveData = await this.repository.saveJobrole(name);
            return saveData;
        }catch(err){
            throw err;
        }
    }

    async getCategory(){
        try{
            let categories = await this.repository.getCategory();
            return categories;
        }catch(err){
            throw err;
        }
    }

    async getJobrole(){
        try{
            let jobrole = await this.repository.getJobrole();
            return jobrole
        }catch(err){
            throw err;
        }
    }

    async deleteJobrole(id:string){
        try{
            let res = await this.repository.deleteJobrole(id);
            return res;
        }catch(err){
            throw err;
        }
    }

    async editJobrole(id:string,name:string){
        try{
            let res = await this.repository.editJobrole(id,name);
            return res;
        }catch(err){
            throw err;
        }
    }
}

export default AdminUsecase;