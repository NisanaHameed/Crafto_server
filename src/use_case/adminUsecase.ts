import Admin from "../domain/admin";
import AdminRepository from "./interface/adminInterface";
import JWT from "../infrastructure/utils/jwt";
import HashPassword from "../infrastructure/utils/hashPassword";

class AdminUsecase{
    private repository;
    private jwt;
    private hash;
    constructor(repository:AdminRepository,jwt:JWT,hash:HashPassword){
        this.repository = repository;
        this.jwt = jwt;
        this.hash = hash;
    }

    async login(email:string,password:string){
        try{
            let findAdmin:any = await this.repository.findAdminByEmail(email);
            if(findAdmin){
                let passwordCheck = await this.hash.compare(password,findAdmin.password);
                if(passwordCheck){
                    let token = JWT.generateToken(findAdmin._id,'admin')
                    return {success:true,adminData:findAdmin,token}
                }else{
                    return {success:false,message:"Incorrect password"}
                }
            }else{
                return {success:false,message:"Email not found"}
            }
        }catch(err){
            console.log(err);
            throw err;
        }
    }
    async getUsers(){
        try{
            let users = await this.repository.getUsers();
            return users;
        }catch(err){
            console.log(err);
            throw err;
        }
    }
    async blockUser(id:string){
        try{
            let blocked = await this.repository.blockUser(id);
            return blocked;
        }catch(err){
            console.log(err);
            throw err;
        }
    }
    async getProfessionals(){
        try{
            let profs = await this.repository.getProfessionals();
            return profs;
        }catch(err){
            console.log(err);
            throw err;
        }
    }
    async blockProfessional(id:string){
        try{
            let blocked = await this.repository.blockProfessional(id);
            return blocked;
        }catch(err){
            console.log(err);
            throw err;
        }
    }
}

export default AdminUsecase;