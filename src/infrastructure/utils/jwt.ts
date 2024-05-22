import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

class JWT {
  private authSecret;
  constructor() {
    this.authSecret = process.env.AUTH_SECRET || "";
  }
  generateToken(Id: string, role: string): string {
    try {
      let payload = { Id, role }
      const token = jwt.sign(payload, this.authSecret, { expiresIn: '30d' });
      return token;
    } catch (error) {
      throw error;
    }
  }
  verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.authSecret) as JwtPayload;
      return decoded;
    } catch (err) {
      throw err;
    }
  }

}
export default JWT;