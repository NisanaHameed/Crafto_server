import jwt,{JwtPayload} from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../../domain/user'
dotenv.config()

class JWT{
    private static authSecret = process.env.auth_secret || ""
    static generateToken(Id: string,role:string): string {
        try {
          let payload = {Id,role}
          const token = jwt.sign(payload, this.authSecret, { expiresIn: '10d' });
          return token;
        } catch (error) {
          console.error('Error while generating JWT token:', error);
          throw error;
        }
      }
      static verifyToken(token:string):JwtPayload | null{
        try{
          const decoded = jwt.verify(token,this.authSecret) as JwtPayload;
          return decoded;
        }catch(err){
          console.error('Error while verifying JWT token:',err);
          return null;
        }
      }
     
}
export default JWT;