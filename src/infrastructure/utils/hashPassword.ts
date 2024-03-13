import bcrypt from 'bcrypt';

class HashPassword{
   
    async hashPassword(password:string){
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            return hashedPassword;
        } catch (error) {
            console.error('Error while hashing password:', error);
            throw error; 
        }
    }
    async compare(password:string,encrypted:string){
        try{
            let isValid = await bcrypt.compare(password,encrypted);
            return isValid;
        }catch(err){
            console.log("Error while comapring password");
            throw err;
        }
    }
}
export default HashPassword;