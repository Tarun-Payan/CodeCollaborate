import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(400).json({success: false, message: "Unauthorized - no token provided"})
    }

    try{
        const decode = jwt.verify(token, process.env.SECRET_KEY)

        if(!decode) return res.status(400).json({success: false, meassage: "Unauthorized - invalid token"})

        req.userId = decode.id;
        next();
    } catch(error){
        console.log("Error in varification ", error)
        return res.status(400).json({success: false, message: "Server error"})
    }
}