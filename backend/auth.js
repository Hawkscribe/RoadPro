import jwt from 'jsonwebtoken';
import dotenv from "dotenv";  
dotenv.config();  

const JWT_SECRET = process.env.JWT_SECRET;

export const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization");
      //  console.log(token);
        

        if (!token) {
            return res.status(401).json({ msg: 'No token provided, authentication failed' });
        }

        // Verify the token
        const decodedData = jwt.verify(token, JWT_SECRET);
        console.log(decodedData);
        

        req.userId = decodedData.id; // Attach the user ID to req
        next(); // Continue to the next middleware
    } catch (error) {
        res.status(401).json({ msg: 'Invalid token, authentication failed' });
    }
};
