import jwt from "jsonwebtoken";

export const verifyToken = ((req,res,next) => {

    try {
        //Grab token from header
        const token = req.header('Authorization')
    
        if(!token){
            return res.status(401).json({ message: "Access denied. No token provided." });
        }
        //Verify user
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        //Attach user info to request
        req.user = decodedToken;

        //continue to the next middleware or route
        next()
        
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        return res.status(403).json({ message: "Invalid or expired token." });        
    }
})
