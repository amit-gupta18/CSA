import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = (req: any, res: any, next: any) => {  
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    
    if(!process.env.JWT_SECRET_KEY) {
        return res.status(500).json({ error: "Internal Server Error" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err: any, decoded: any) => {
        if (err) {
            return res.status(403).json({ error: "Forbidden" });
        }
        req.user = decoded;
        next();
    });
}